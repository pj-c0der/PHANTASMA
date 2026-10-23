import html
import logging
import os
import smtplib
import ssl
import time
from dataclasses import dataclass
from email.message import EmailMessage
from pathlib import Path

from dotenv import load_dotenv

from app.models import ProjectInquiry

logger = logging.getLogger(__name__)

DEFAULT_NOTIFICATION_EMAIL = "phantasma.studio26@gmail.com"
DEFAULT_SMTP_HOST = "smtp.gmail.com"
DEFAULT_SMTP_PORT = 587
DEFAULT_SEND_ATTEMPTS = 3
DEFAULT_RETRY_DELAY_SECONDS = 2.0
SMTP_TIMEOUT_SECONDS = 15
SUBJECT = "New Booking Request – Pending Verification"

load_dotenv(Path(__file__).resolve().parent.parent / ".env")


@dataclass(frozen=True)
class EmailSettings:
    host: str
    port: int
    username: str
    password: str
    recipient: str
    send_attempts: int
    retry_delay_seconds: float


def _read_int(name: str, default: int, minimum: int) -> int:
    raw = os.getenv(name, "").strip()
    if not raw:
        return default
    try:
        value = int(raw)
    except ValueError:
        logger.warning("%s must be a number; using %s.", name, default)
        return default
    if value < minimum:
        logger.warning("%s must be at least %s; using %s.", name, minimum, default)
        return default
    return value


def _read_float(name: str, default: float, minimum: float) -> float:
    raw = os.getenv(name, "").strip()
    if not raw:
        return default
    try:
        value = float(raw)
    except ValueError:
        logger.warning("%s must be a number; using %s.", name, default)
        return default
    if value < minimum:
        logger.warning("%s must be at least %s; using %s.", name, minimum, default)
        return default
    return value


def _load_settings(booking_id: int) -> EmailSettings | None:
    username = os.getenv("SMTP_USERNAME", "").strip()
    password = os.getenv("SMTP_PASSWORD", "").replace(" ", "")
    recipient = os.getenv(
        "BOOKING_NOTIFICATION_EMAIL", DEFAULT_NOTIFICATION_EMAIL
    ).strip()
    host = os.getenv("SMTP_HOST", DEFAULT_SMTP_HOST).strip() or DEFAULT_SMTP_HOST

    missing = [
        name
        for name, value in (
            ("SMTP_USERNAME", username),
            ("SMTP_PASSWORD", password),
            ("BOOKING_NOTIFICATION_EMAIL", recipient),
        )
        if not value
    ]
    if missing:
        logger.warning(
            "Booking #%s was saved, but its email notification was not sent. "
            "Missing configuration: %s.",
            booking_id,
            ", ".join(missing),
        )
        return None

    return EmailSettings(
        host=host,
        port=_read_int("SMTP_PORT", DEFAULT_SMTP_PORT, minimum=1),
        username=username,
        password=password,
        recipient=recipient,
        send_attempts=_read_int(
            "EMAIL_SEND_ATTEMPTS", DEFAULT_SEND_ATTEMPTS, minimum=1
        ),
        retry_delay_seconds=_read_float(
            "EMAIL_RETRY_DELAY_SECONDS", DEFAULT_RETRY_DELAY_SECONDS, minimum=0.0
        ),
    )


def _display(value: object, fallback: str = "Not provided") -> str:
    if value is None:
        return fallback
    text = str(value).strip()
    return text or fallback


def _safe_error(error: Exception) -> str:
    text = " ".join(str(error).split())
    if not text:
        return type(error).__name__
    if len(text) > 300:
        text = f"{text[:297]}..."
    return f"{type(error).__name__}: {text}"


def _plain_body(inquiry: ProjectInquiry) -> str:
    return "\n".join(
        (
            "New Booking Request – Pending Verification",
            "",
            f"Booking reference: #{inquiry.id}",
            f"Submitted: {_display(inquiry.submitted_at)}",
            "",
            "CUSTOMER DETAILS",
            "----------------",
            f"Full name: {_display(inquiry.full_name)}",
            f"Email: {_display(inquiry.email)}",
            f"Contact number: {_display(inquiry.contact_number)}",
            "",
            "BOOKING DETAILS",
            "---------------",
            f"Service: {_display(inquiry.service)}",
            f"Project date: {_display(inquiry.project_date)}",
            f"Location: {_display(inquiry.location)}",
            f"Estimated scope: {_display(inquiry.scope)}",
            f"Budget: {_display(inquiry.budget)}",
            "",
            "NOTES / REQUESTS",
            "----------------",
            _display(inquiry.project_details),
            "",
            "Reply directly to this email to contact the customer.",
        )
    )


def _html_body(inquiry: ProjectInquiry) -> str:
    def escape(value: object) -> str:
        return html.escape(_display(value))

    notes = html.escape(_display(inquiry.project_details)).replace("\n", "<br />")
    row = (
        '<tr>'
        '<td style="padding:10px 0;color:#9b9b9b;font-size:12px;'
        'text-transform:uppercase;letter-spacing:1px;vertical-align:top;">{label}</td>'
        '<td style="padding:10px 0;color:#fdfbf7;font-size:15px;'
        'text-align:right;vertical-align:top;">{value}</td>'
        "</tr>"
    )
    rows = "".join(
        row.format(label=label, value=value)
        for label, value in (
            ("Booking reference", f"#{inquiry.id}"),
            ("Submitted", escape(inquiry.submitted_at)),
            ("Full name", escape(inquiry.full_name)),
            ("Email", escape(inquiry.email)),
            ("Contact number", escape(inquiry.contact_number)),
            ("Service", escape(inquiry.service)),
            ("Project date", escape(inquiry.project_date)),
            ("Location", escape(inquiry.location)),
            ("Estimated scope", escape(inquiry.scope)),
            ("Budget", escape(inquiry.budget)),
        )
    )

    return f"""<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#0a0a0a;">
    <div style="max-width:640px;margin:0 auto;padding:36px 28px;
      background:#0a0a0a;color:#fdfbf7;
      font-family:Arial,Helvetica,sans-serif;line-height:1.6;">
      <p style="margin:0 0 28px;color:#9b9b9b;font-size:11px;
        text-transform:uppercase;letter-spacing:4px;">Phantasma Studio</p>
      <h1 style="margin:0 0 12px;font-size:28px;font-weight:600;color:#fdfbf7;">
        New Booking Request
      </h1>
      <p style="margin:0 0 28px;">
        <span style="display:inline-block;padding:6px 12px;border:1px solid #6b4c8a;
          border-radius:999px;color:#c9b6dd;font-size:12px;
          text-transform:uppercase;letter-spacing:1px;">Pending Verification</span>
      </p>
      <table style="width:100%;border-collapse:collapse;border-top:1px solid #2a2a2a;">
        {rows}
      </table>
      <h2 style="margin:28px 0 10px;font-size:15px;color:#c9b6dd;
        text-transform:uppercase;letter-spacing:2px;">Notes / requests</h2>
      <p style="margin:0;padding:18px;background:#151515;border-left:2px solid #6b4c8a;
        color:#d8d4cc;font-size:14px;">{notes}</p>
      <p style="margin:28px 0 0;color:#9b9b9b;font-size:12px;">
        Reply directly to this email to contact the customer.
      </p>
    </div>
  </body>
</html>"""


def _build_message(inquiry: ProjectInquiry, settings: EmailSettings) -> EmailMessage:
    message = EmailMessage()
    message["Subject"] = SUBJECT
    message["From"] = settings.username
    message["To"] = settings.recipient
    message["Reply-To"] = inquiry.email
    message.set_content(_plain_body(inquiry))
    message.add_alternative(_html_body(inquiry), subtype="html")
    return message


def _deliver(message: EmailMessage, settings: EmailSettings) -> None:
    with smtplib.SMTP(
        settings.host, settings.port, timeout=SMTP_TIMEOUT_SECONDS
    ) as smtp:
        smtp.starttls(context=ssl.create_default_context())
        smtp.login(settings.username, settings.password)
        smtp.send_message(message)


def send_booking_notification(inquiry: ProjectInquiry) -> bool:
    settings = _load_settings(inquiry.id)
    if settings is None:
        return False

    try:
        message = _build_message(inquiry, settings)
    except (TypeError, ValueError) as error:
        logger.error(
            "Booking #%s was saved, but its email notification could not be "
            "prepared: %s",
            inquiry.id,
            _safe_error(error),
        )
        return False

    for attempt in range(1, settings.send_attempts + 1):
        try:
            _deliver(message, settings)
        except smtplib.SMTPAuthenticationError:
            logger.error(
                "Booking #%s was saved, but Gmail rejected the SMTP "
                "authentication. Check SMTP_USERNAME and the Gmail App Password.",
                inquiry.id,
            )
            return False
        except smtplib.SMTPRecipientsRefused:
            logger.error(
                "Booking #%s was saved, but Gmail refused the notification "
                "recipient. Check BOOKING_NOTIFICATION_EMAIL.",
                inquiry.id,
            )
            return False
        except Exception as error:
            safe_error = _safe_error(error)
            if attempt >= settings.send_attempts:
                logger.error(
                    "Booking #%s was saved, but its email notification failed "
                    "after %s attempt(s): %s",
                    inquiry.id,
                    attempt,
                    safe_error,
                )
                return False
            logger.warning(
                "Booking #%s email notification attempt %s/%s failed; "
                "retrying: %s",
                inquiry.id,
                attempt,
                settings.send_attempts,
                safe_error,
            )
            if settings.retry_delay_seconds > 0:
                time.sleep(settings.retry_delay_seconds)
        else:
            logger.info(
                "Booking #%s email notification was accepted by the SMTP server.",
                inquiry.id,
            )
            return True

    return False
