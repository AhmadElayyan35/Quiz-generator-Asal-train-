from datetime import datetime
from typing import Literal

from pydantic import BaseModel, PositiveInt


class DetailedAnswerItem(BaseModel):
    question_number: int
    question: str
    type: Literal["multiple_choice", "short_answer"]
    choices: list[str] | None = None
    correct_answer: str
    explanation: str
    user_answer: str


class QuizAttemptOut(BaseModel):
    id: PositiveInt
    submitted_at: datetime
    category_id: PositiveInt
    path: str

    class Config:
        from_attributes = True


class QuizAttemptDetailOut(BaseModel):
    id: PositiveInt
    submitted_at: datetime
    category_id: PositiveInt
    path: str
    answers: list[DetailedAnswerItem]

    class Config:
        from_attributes = True


class AttemptCreateRequest(BaseModel):
    category_id: PositiveInt
    answers: list[DetailedAnswerItem]
