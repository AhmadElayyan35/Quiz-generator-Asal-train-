from datetime import datetime
from typing import Literal

from app.schemas.question_schema import QuestionSchema
from pydantic import BaseModel, Field, PositiveInt, field_validator


class QuizBase(BaseModel):
    name: str = Field(min_length=3, max_length=100)
    level: Literal["easy", "medium", "hard"]

    @field_validator("name")
    def validate_quiz_name(cls, quiz_name: str):
        quiz_name = quiz_name.strip()
        if len(quiz_name) == 0:
            raise ValueError("Quiz name cannot be empty or whitespace.")
        if not all(q.isalnum() or q.isspace() for q in quiz_name):
            raise ValueError("Quiz name must be alphanumeric.")
        return quiz_name

    class Config:
        orm_mode = True


class QuizForm(QuizBase):
    pass


class QuizOut(QuizBase):
    id: PositiveInt
    path: str
    category_id: PositiveInt
    created_at: datetime


class QuizDetailOut(QuizOut):
    questions: list[QuestionSchema] | None = None


class QuizSaveIn(QuizBase):
    index_name: str
    questions: list[QuestionSchema]
