import re
from datetime import date, datetime
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


def to_camel(value: str) -> str:
    first, *rest = value.split("_")
    return first + "".join(part.capitalize() for part in rest)


class SubmissionSchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    full_name: Annotated[str, Field(min_length=1, max_length=120)]
    email: Annotated[str, Field(min_length=3, max_length=254)]
    contact_number: Annotated[str | None, Field(max_length=40)] = None

    @field_validator("full_name", "email", "contact_number", mode="before")
    @classmethod
    def strip_text(cls, value: object) -> object:
        return value.strip() if isinstance(value, str) else value

    @field_validator("full_name")
    @classmethod
    def require_non_blank_name(cls, value: str) -> str:
        if not value:
            raise ValueError("Full name must not be blank")
        return value

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", value):
            raise ValueError("Enter a valid email address")
        return value


class ContactMessageCreate(SubmissionSchema):
    subject: Annotated[str | None, Field(max_length=200)] = None
    message: Annotated[str, Field(min_length=1, max_length=10000)]

    @field_validator("subject", "message")
    @classmethod
    def strip_message_text(cls, value: str | None) -> str | None:
        return value.strip() if value is not None else None

    @field_validator("message")
    @classmethod
    def require_non_blank_message(cls, value: str) -> str:
        if not value:
            raise ValueError("Message must not be blank")
        return value


class ProjectInquiryCreate(SubmissionSchema):
    contact_number: Annotated[str, Field(min_length=1, max_length=40)]
    service: Literal[
        "Photography",
        "Video Production & Post-Production",
        "Graphic Design",
        "Photobooks & Keepsakes",
        "Digital Presets & Templates",
        "Other",
    ]
    project_date: date
    location: Annotated[str, Field(min_length=1, max_length=240)]
    scope: Annotated[str, Field(min_length=1, max_length=240)]
    budget: Annotated[str | None, Field(max_length=120)] = None
    project_details: Annotated[str, Field(min_length=1, max_length=10000)]

    @field_validator(
        "contact_number",
        "location",
        "scope",
        "budget",
        "project_details",
        mode="before",
    )
    @classmethod
    def strip_project_text(cls, value: object) -> object:
        return value.strip() if isinstance(value, str) else value

    @field_validator("contact_number", "location", "scope", "project_details")
    @classmethod
    def require_non_blank_text(cls, value: str) -> str:
        if not value:
            raise ValueError("This field must not be blank")
        return value


class SubmissionResponse(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        from_attributes=True,
        populate_by_name=True,
    )

    id: int
    submitted_at: datetime


class ContactMessageResponse(SubmissionResponse):
    pass


class ProjectInquiryResponse(SubmissionResponse):
    email_notification_sent: bool
