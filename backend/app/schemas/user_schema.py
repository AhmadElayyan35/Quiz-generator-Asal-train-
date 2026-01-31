import re
from datetime import datetime

from app.models.db_models import Category, User
from app.schemas.category_schema import CategoryOut
from app.schemas.document_schema import DocumentOut
from app.schemas.quiz_attempt_schema import QuizAttemptOut
from app.schemas.quiz_schema import QuizOut
from pydantic import BaseModel, EmailStr, Field, PositiveInt, field_validator


def check_password_strength(password: str):
    if len(password.strip()) < 8:
        raise ValueError("Password must be at least 8 characters long.")
    if not re.search(r"[A-Z]", password):
        raise ValueError("Password must contain at least one uppercase letter.")
    if not re.search(r"[a-z]", password):
        raise ValueError("Password must contain at least one lowercase letter.")
    if not re.search(r"\d", password):
        raise ValueError("Password must contain at least one digit.")
    if not re.search(r"[-_@#&]", password):
        raise ValueError(
            "Password must contain at least one special character (-,_,@,#,&)."
        )
    return password.strip()


def validate_name(name: str):
    name = name.strip()
    if len(name) == 0:
        raise ValueError("Name cannot be empty or whitespace.")
    if not all(c.isalnum() or c.isspace() for c in name):
        raise ValueError("Name must be alphanumeric.")
    return name


def validate_email(email: str):
    email = email.strip()
    if len(email) == 0:
        raise ValueError("Email cannot be empty or whitespace.")
    return email


class BaseUser(BaseModel):
    name: str = Field(min_length=3, max_length=100)
    email: EmailStr

    @field_validator("name")
    def validate_name_field(cls, name: str):
        return validate_name(name)

    @field_validator("email")
    def validate_email_field(cls, email: str):
        return validate_email(email)


class UserSignup(BaseUser):
    password: str

    @field_validator("password")
    def validate_password(cls, password: str):
        return check_password_strength(password)

    class Config:
        orm_mode = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str

    @field_validator("email")
    def validate_email(cls, email: str):
        return validate_email(email)

    @field_validator("password")
    def validate_password(cls, password: str):
        if not password.strip():
            raise ValueError("Password cannot be empty.")
        return password.strip()

    class Config:
        orm_mode = True


class UserOut(BaseUser):
    id: PositiveInt
    created_at: datetime

    class Config:
        orm_mode = True


class SignupResponse(BaseModel):
    id: PositiveInt
    name: str
    email: EmailStr
    created_at: datetime

    @field_validator("name")
    def validate_name_field(cls, name: str):
        return validate_name(name)

    @field_validator("email")
    def validate_email_field(cls, email: str):
        return validate_email(email)

    class Config:
        orm_mode = True


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: PositiveInt

    @field_validator("access_token", "token_type")
    def validate_token_fields(cls, token_field: str):
        token_field = token_field.strip()
        if len(token_field) == 0:
            raise ValueError("This field cannot be empty or whitespace.")
        return token_field.strip()

    class Config:
        orm_mode = True


class UserDetailsResponse(BaseModel):
    user: UserOut
    categories: list[CategoryOut]
    documents: list[DocumentOut]
    quizzes: list[QuizOut]
    attempts: list[QuizAttemptOut]

    class Config:
        orm_mode = True


def serializeUser(user: User):
    return UserOut(
        id=user.id,
        name=user.name,
        email=user.email,
        created_at=user.created_at,
    )


def serializeCategories(categories: list[Category]):
    return [CategoryOut(id=cat.id, name=cat.name) for cat in categories]


def serializeDocuments(categories: list[Category]):
    return [
        DocumentOut(
            id=doc.id, name=doc.name, path=doc.path, category_id=doc.category_id
        )
        for cat in categories
        for doc in cat.documents
    ]


def serializeQuizzes(categories: list[Category]):
    return [
        QuizOut(
            id=quiz.id,
            name=quiz.name,
            level=quiz.level,
            path=quiz.path,
            category_id=quiz.category_id,
            created_at=quiz.created_at,
        )
        for cat in categories
        for quiz in cat.quizzes
    ]


def serializeAttempts(categories: list[Category]):
    return [
        QuizAttemptOut(
            id=attempt.id,
            submitted_at=attempt.submitted_at,
            category_id=attempt.category_id,
            path=attempt.path,
        )
        for cat in categories
        for attempt in cat.quiz_attempts
    ]
