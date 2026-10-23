# Booking Email Notifications

Every booking saved through `POST /api/project-inquiries` sends a notification
to the company Gmail account. The email is sent only after the database commit
succeeds. If email delivery fails, the booking remains saved.

## 1. Create a Gmail App Password

1. Sign in to the company Gmail account.
2. Enable **2-Step Verification** in Google Account settings.
3. Open **Google Account > Security > App passwords**.
4. Create an app password for **Mail**.
5. Copy the 16-character password. Do not use the normal Gmail password.

Google may display the app password in four groups separated by spaces. The
backend removes spaces automatically, so either format works.

## 2. Configure the backend

Edit `backend/.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=phantasma.studio26@gmail.com
SMTP_PASSWORD=your-google-app-password
BOOKING_NOTIFICATION_EMAIL=phantasma.studio26@gmail.com

EMAIL_SEND_ATTEMPTS=3
EMAIL_RETRY_DELAY_SECONDS=2
```

- `SMTP_USERNAME` is the sending Gmail address.
- `BOOKING_NOTIFICATION_EMAIL` is the inbox that receives booking notifications.
- `EMAIL_SEND_ATTEMPTS` controls automatic retries for temporary failures.
- `EMAIL_RETRY_DELAY_SECONDS` controls the delay between attempts.

`backend/.env` is ignored by git. Never commit the App Password or paste it
into frontend code, API responses, or logs.

## 3. What the company receives

The company email includes:

- Booking reference (`#<booking id>`)
- Submission timestamp
- Customer full name, email address, and contact number
- Service or booking type
- Project date
- Location
- Estimated project scope
- Budget, if provided
- Project details and additional notes

The customer's address is set as `Reply-To`, so replying to the notification
contacts the customer directly.

## 4. Delivery behavior

- Temporary connection, timeout, and SMTP server errors are retried
  automatically up to `EMAIL_SEND_ATTEMPTS`.
- Invalid Gmail credentials are not retried. The backend logs a safe message
  asking staff to check `SMTP_USERNAME` and the Gmail App Password.
- Refused recipients are not retried.
- A failed notification never deletes or rolls back the booking.
- The booking response includes `emailNotificationSent`, which the website uses
  to display its existing delivery warning.

## 5. Troubleshooting

- **Authentication rejected:** confirm 2-Step Verification is enabled and
  generate a new App Password. Replace `SMTP_PASSWORD` and restart the backend.
- **Connection timeout:** confirm outbound port 587 is allowed by the network
  or hosting provider.
- **Email goes to spam:** add the sending address to contacts and check the
  Gmail spam folder.
- **No email after a successful submission:** check the backend logs for the
  booking ID and the safe SMTP error message.

## 6. Limitations

- The current website form does not transmit selected attachments, so the
  notification includes only submitted text fields. Sending attachments would
  require frontend upload changes.
- The website does not collect a booking time, so the notification does not
  include one.
