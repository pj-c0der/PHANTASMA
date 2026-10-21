Backend Agent Rules
Stack: Python 3.10+, FastAPI, SQLAlchemy, Pydantic.

Database: SQLite for local development.

Typing: Use modern Python 3.10+ typing syntax (e.g., str | None instead of Optional[str]).

Strict Validation: All incoming API requests must be validated using Pydantic schemas.

Business Logic Constraints:

File Uploads: Must strictly enforce a 25MB file size limit and validate file types (PDF, JPG, PNG, MP4).

Email Notifications: Email dispatch must be handled independently of database insertion. If an email fails to send, the database record must still be preserved.
