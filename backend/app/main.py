from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.email_notifications import send_booking_notification
from app.models import ContactMessage, ProjectInquiry
from app.schemas import (
    ContactMessageCreate,
    ContactMessageResponse,
    ProjectInquiryCreate,
    ProjectInquiryResponse,
)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncGenerator[None, None]:
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="Phantasma Studio API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/")
def health_check():
    return {"status": "ok", "message": "Phantasma Studio API is running"}


@app.post(
    "/api/contact-messages",
    response_model=ContactMessageResponse,
    status_code=201,
)
def create_contact_message(
    submission: ContactMessageCreate,
    db: Annotated[Session, Depends(get_db)],
) -> ContactMessage:
    message = ContactMessage(**submission.model_dump())
    db.add(message)
    db.commit()
    return message


@app.post(
    "/api/project-inquiries",
    response_model=ProjectInquiryResponse,
    status_code=201,
)
def create_project_inquiry(
    submission: ProjectInquiryCreate,
    db: Annotated[Session, Depends(get_db)],
) -> ProjectInquiryResponse:
    inquiry = ProjectInquiry(**submission.model_dump())
    db.add(inquiry)
    db.commit()
    email_notification_sent = send_booking_notification(inquiry)
    return ProjectInquiryResponse(
        id=inquiry.id,
        submitted_at=inquiry.submitted_at,
        email_notification_sent=email_notification_sent,
    )