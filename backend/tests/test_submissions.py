import unittest
from datetime import date, datetime
from smtplib import SMTPAuthenticationError, SMTPException, SMTPServerDisconnected
from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app import main
from app.database import Base, get_db
from app.main import app
from app.models import ContactMessage, ProjectInquiry


class SubmissionEndpointTests(unittest.TestCase):
    def setUp(self) -> None:
        self.original_engine = main.engine
        self.engine = create_engine(
            "sqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        self.session_local = sessionmaker(
            bind=self.engine,
            autoflush=False,
            expire_on_commit=False,
        )
        main.engine = self.engine

        self.env_patcher = patch.dict(
            "os.environ",
            {
                "SMTP_HOST": "",
                "SMTP_USERNAME": "",
                "SMTP_PASSWORD": "",
                "BOOKING_NOTIFICATION_EMAIL": "",
                "EMAIL_SEND_ATTEMPTS": "1",
                "EMAIL_RETRY_DELAY_SECONDS": "0",
            },
        )
        self.env_patcher.start()

        def override_get_db():
            with self.session_local() as db:
                yield db

        app.dependency_overrides[get_db] = override_get_db
        self.client = TestClient(app)
        self.client.__enter__()

    def tearDown(self) -> None:
        self.client.__exit__(None, None, None)
        app.dependency_overrides.clear()
        Base.metadata.drop_all(bind=self.engine)
        self.engine.dispose()
        main.engine = self.original_engine
        self.env_patcher.stop()

    def test_contact_message_is_persisted(self) -> None:
        response = self.client.post(
            "/api/contact-messages",
            json={
                "fullName": "Jane Doe",
                "email": "jane@example.com",
                "contactNumber": "+63 917 123 4567",
                "subject": "Project inquiry",
                "message": "I would like to discuss a project.",
            },
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["id"], 1)
        submitted_at = datetime.fromisoformat(response.json()["submittedAt"])
        self.assertIsNotNone(submitted_at.utcoffset())
        with self.session_local() as db:
            saved = db.get(ContactMessage, 1)
            self.assertIsNotNone(saved)
            self.assertEqual(saved.full_name, "Jane Doe")
            self.assertEqual(saved.message, "I would like to discuss a project.")

    def test_project_inquiry_is_persisted(self) -> None:
        response = self.client.post(
            "/api/project-inquiries",
            json={
                "fullName": "Jane Doe",
                "email": "jane@example.com",
                "contactNumber": "+63 917 123 4567",
                "service": "Photography",
                "projectDate": "2026-11-15",
                "location": "Pasig City",
                "scope": "One-day event",
                "projectDetails": "A family celebration.",
            },
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["id"], 1)
        submitted_at = datetime.fromisoformat(response.json()["submittedAt"])
        self.assertIsNotNone(submitted_at.utcoffset())
        with self.session_local() as db:
            saved = db.get(ProjectInquiry, 1)
            self.assertIsNotNone(saved)
            self.assertEqual(saved.service, "Photography")
            self.assertEqual(saved.project_date, date(2026, 11, 15))

    def test_booking_sends_email_notification(self) -> None:
        smtp_settings = {
            "SMTP_USERNAME": "phantasma.studio26@gmail.com",
            "SMTP_PASSWORD": "test-app-password",
            "BOOKING_NOTIFICATION_EMAIL": "phantasma.studio26@gmail.com",
            "EMAIL_SEND_ATTEMPTS": "3",
            "EMAIL_RETRY_DELAY_SECONDS": "0",
        }
        with (
            patch.dict("os.environ", smtp_settings),
            patch("app.email_notifications.smtplib.SMTP") as smtp_factory,
            patch("app.email_notifications.logger.info") as email_info,
        ):
            response = self.client.post(
                "/api/project-inquiries",
                json={
                    "fullName": "Jane Doe",
                    "email": "jane@example.com",
                    "contactNumber": "+63 917 123 4567",
                    "service": "Photography",
                    "projectDate": "2026-11-15",
                    "location": "Pasig City",
                    "scope": "One-day event",
                    "budget": "PHP 50,000",
                    "projectDetails": "A family celebration <3.",
                },
            )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json()["emailNotificationSent"])
        email_info.assert_called_once_with(
            "Booking #%s email notification was accepted by the SMTP server.",
            1,
        )
        smtp = smtp_factory.return_value.__enter__.return_value
        smtp.login.assert_called_once_with(
            "phantasma.studio26@gmail.com", "test-app-password"
        )
        sent_message = smtp.send_message.call_args.args[0]
        self.assertEqual(
            sent_message["Subject"],
            "New Booking Request – Pending Verification",
        )
        self.assertEqual(sent_message["To"], "phantasma.studio26@gmail.com")
        self.assertEqual(sent_message["Reply-To"], "jane@example.com")

        plain_body = sent_message.get_body(preferencelist=("plain",))
        self.assertIsNotNone(plain_body)
        content = plain_body.get_content()
        for expected in (
            "Booking reference: #1",
            "Jane Doe",
            "jane@example.com",
            "+63 917 123 4567",
            "Photography",
            "2026-11-15",
            "Pasig City",
            "One-day event",
            "PHP 50,000",
            "A family celebration <3.",
        ):
            self.assertIn(expected, content)

        html_body = sent_message.get_body(preferencelist=("html",))
        self.assertIsNotNone(html_body)
        html_content = html_body.get_content()
        self.assertIn("Jane Doe", html_content)
        self.assertIn("&lt;3", html_content)
        self.assertNotIn("A family celebration <3.", html_content)

    def test_booking_is_persisted_before_email_is_sent(self) -> None:
        def verify_saved(inquiry: ProjectInquiry) -> bool:
            with self.session_local() as db:
                saved = db.get(ProjectInquiry, inquiry.id)
                self.assertIsNotNone(saved)
                self.assertEqual(saved.full_name, "Jane Doe")
            return True

        with patch(
            "app.main.send_booking_notification", side_effect=verify_saved
        ) as send_notification:
            response = self.client.post(
                "/api/project-inquiries",
                json={
                    "fullName": "Jane Doe",
                    "email": "jane@example.com",
                    "contactNumber": "+63 917 123 4567",
                    "service": "Photography",
                    "projectDate": "2026-11-15",
                    "location": "Pasig City",
                    "scope": "One-day event",
                    "projectDetails": "A family celebration.",
                },
            )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json()["emailNotificationSent"])
        send_notification.assert_called_once()

    def test_transient_email_failure_is_retried(self) -> None:
        smtp_settings = {
            "SMTP_USERNAME": "phantasma.studio26@gmail.com",
            "SMTP_PASSWORD": "test-app-password",
            "BOOKING_NOTIFICATION_EMAIL": "phantasma.studio26@gmail.com",
            "EMAIL_SEND_ATTEMPTS": "3",
            "EMAIL_RETRY_DELAY_SECONDS": "1",
        }
        successful_smtp = MagicMock()
        with (
            patch.dict("os.environ", smtp_settings),
            patch(
                "app.email_notifications.smtplib.SMTP",
                side_effect=[
                    SMTPServerDisconnected("temporary failure"),
                    SMTPException("temporary failure"),
                    successful_smtp,
                ],
            ) as smtp_factory,
            patch("app.email_notifications.time.sleep") as sleep,
        ):
            response = self.client.post(
                "/api/project-inquiries",
                json={
                    "fullName": "Jane Doe",
                    "email": "jane@example.com",
                    "contactNumber": "+63 917 123 4567",
                    "service": "Photography",
                    "projectDate": "2026-11-15",
                    "location": "Pasig City",
                    "scope": "One-day event",
                    "projectDetails": "A family celebration.",
                },
            )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json()["emailNotificationSent"])
        self.assertEqual(smtp_factory.call_count, 3)
        self.assertEqual(sleep.call_count, 2)
        successful_smtp.__enter__.return_value.send_message.assert_called_once()

    def test_invalid_smtp_credentials_are_not_retried(self) -> None:
        smtp_settings = {
            "SMTP_USERNAME": "phantasma.studio26@gmail.com",
            "SMTP_PASSWORD": "wrong-app-password",
            "BOOKING_NOTIFICATION_EMAIL": "phantasma.studio26@gmail.com",
            "EMAIL_SEND_ATTEMPTS": "3",
            "EMAIL_RETRY_DELAY_SECONDS": "0",
        }
        with (
            patch.dict("os.environ", smtp_settings),
            patch(
                "app.email_notifications.smtplib.SMTP",
                side_effect=SMTPAuthenticationError(535, b"bad credentials"),
            ) as smtp_factory,
            patch("app.email_notifications.time.sleep") as sleep,
        ):
            response = self.client.post(
                "/api/project-inquiries",
                json={
                    "fullName": "Jane Doe",
                    "email": "jane@example.com",
                    "contactNumber": "+63 917 123 4567",
                    "service": "Photography",
                    "projectDate": "2026-11-15",
                    "location": "Pasig City",
                    "scope": "One-day event",
                    "projectDetails": "A family celebration.",
                },
            )

        self.assertEqual(response.status_code, 201)
        self.assertFalse(response.json()["emailNotificationSent"])
        self.assertEqual(smtp_factory.call_count, 1)
        sleep.assert_not_called()
        with self.session_local() as db:
            saved = db.get(ProjectInquiry, response.json()["id"])
            self.assertIsNotNone(saved)

    def test_email_failure_does_not_discard_saved_booking(self) -> None:
        smtp_settings = {
            "SMTP_USERNAME": "phantasma.studio26@gmail.com",
            "SMTP_PASSWORD": "test-app-password",
            "BOOKING_NOTIFICATION_EMAIL": "phantasma.studio26@gmail.com",
            "EMAIL_SEND_ATTEMPTS": "1",
            "EMAIL_RETRY_DELAY_SECONDS": "0",
        }
        with (
            patch.dict("os.environ", smtp_settings),
            patch(
                "app.email_notifications.smtplib.SMTP",
                side_effect=SMTPException("SMTP unavailable"),
            ),
        ):
            response = self.client.post(
                "/api/project-inquiries",
                json={
                    "fullName": "Jane Doe",
                    "email": "jane@example.com",
                    "contactNumber": "+63 917 123 4567",
                    "service": "Photography",
                    "projectDate": "2026-11-15",
                    "location": "Pasig City",
                    "scope": "One-day event",
                    "projectDetails": "A family celebration.",
                },
            )

        self.assertEqual(response.status_code, 201)
        self.assertFalse(response.json()["emailNotificationSent"])
        with self.session_local() as db:
            saved = db.get(ProjectInquiry, response.json()["id"])
            self.assertIsNotNone(saved)

    def test_invalid_contact_message_is_rejected(self) -> None:
        response = self.client.post(
            "/api/contact-messages",
            json={
                "fullName": "Jane Doe",
                "email": "not-an-email",
                "message": "Hello.",
            },
        )

        self.assertEqual(response.status_code, 422)
        with self.session_local() as db:
            self.assertEqual(db.query(ContactMessage).count(), 0)

    def test_invalid_project_date_is_rejected(self) -> None:
        response = self.client.post(
            "/api/project-inquiries",
            json={
                "fullName": "Jane Doe",
                "email": "jane@example.com",
                "service": "Photography",
                "contactNumber": "+63 917 123 4567",
                "projectDate": "not-a-date",
                "location": "Pasig",
                "scope": "One-day event",
                "projectDetails": "A family celebration.",
            },
        )

        self.assertEqual(response.status_code, 422)
        with self.session_local() as db:
            self.assertEqual(db.query(ProjectInquiry).count(), 0)

    def test_unlisted_service_is_rejected(self) -> None:
        response = self.client.post(
            "/api/project-inquiries",
            json={
                "fullName": "Jane Doe",
                "email": "jane@example.com",
                "contactNumber": "+63 917 123 4567",
                "service": "Unlisted service",
                "projectDate": "2026-11-15",
                "location": "Pasig",
                "scope": "One-day event",
                "projectDetails": "A family celebration.",
            },
        )

        self.assertEqual(response.status_code, 422)
        with self.session_local() as db:
            self.assertEqual(db.query(ProjectInquiry).count(), 0)

    def test_project_inquiry_requires_every_non_optional_field(self) -> None:
        complete_submission = {
            "fullName": "Jane Doe",
            "email": "jane@example.com",
            "contactNumber": "+63 917 123 4567",
            "service": "Photography",
            "projectDate": "2026-11-15",
            "location": "Pasig City",
            "scope": "One-day event",
            "projectDetails": "A family celebration.",
        }
        required_fields = (
            "fullName",
            "email",
            "contactNumber",
            "service",
            "projectDate",
            "location",
            "scope",
            "projectDetails",
        )

        for field in required_fields:
            with self.subTest(field=field):
                submission = complete_submission.copy()
                del submission[field]
                response = self.client.post("/api/project-inquiries", json=submission)

                self.assertEqual(response.status_code, 422)
                with self.session_local() as db:
                    self.assertEqual(db.query(ProjectInquiry).count(), 0)

    def test_blank_required_project_text_is_rejected(self) -> None:
        complete_submission = {
            "fullName": "Jane Doe",
            "email": "jane@example.com",
            "contactNumber": "+63 917 123 4567",
            "service": "Photography",
            "projectDate": "2026-11-15",
            "location": "Pasig City",
            "scope": "One-day event",
            "projectDetails": "A family celebration.",
        }

        for field in (
            "fullName",
            "contactNumber",
            "location",
            "scope",
            "projectDetails",
        ):
            with self.subTest(field=field):
                submission = complete_submission.copy()
                submission[field] = "   "
                response = self.client.post("/api/project-inquiries", json=submission)

                self.assertEqual(response.status_code, 422)
                with self.session_local() as db:
                    self.assertEqual(db.query(ProjectInquiry).count(), 0)

    def test_local_frontend_origin_is_allowed(self) -> None:
        response = self.client.options(
            "/api/contact-messages",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "content-type",
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.headers["access-control-allow-origin"],
            "http://localhost:3000",
        )


if __name__ == "__main__":
    unittest.main()
