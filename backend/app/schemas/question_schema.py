from typing import Literal

from pydantic import BaseModel


class QuestionSchema(BaseModel):
    question_number: int
    question: str
    type: Literal["multiple_choice", "short_answer"]
    choices: list[str] | None = None
    correct_answer: str
    explanation: str


class QuizGenerateOut(BaseModel):
    index_name: str
    questions: list[QuestionSchema]


class QuestionRegen(BaseModel):
    index_name: str
    difficulty: str
    question_number: int
    user_prompt: str
    questions: list[QuestionSchema]
