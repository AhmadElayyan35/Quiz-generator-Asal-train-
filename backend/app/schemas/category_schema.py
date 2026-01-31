from app.schemas.document_schema import DocumentOut
from app.schemas.quiz_schema import QuizOut
from pydantic import BaseModel, Field, PositiveInt, field_validator


class CategoryForm(BaseModel):
    name: str = Field(min_length=3, max_length=100)

    @field_validator("name")
    def validate_category_name(cls, category_name):
        if not all(c.isalnum() or c.isspace() for c in category_name):
            raise ValueError("Category name must be alphanumeric.")
        return category_name


class CategoryOut(BaseModel):
    id: PositiveInt
    name: str

    @field_validator("name")
    def validate_category_name(cls, category_name):
        if len(category_name.strip()) == 0:
            raise ValueError("Category name cannot be empty or whitespace.")
        return category_name


class CategoryDetailOut(CategoryOut):
    documents: list[DocumentOut]
    quizzes: list[QuizOut]
