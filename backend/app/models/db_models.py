# Updated models/db_models.py
from datetime import datetime

from app.database.connection_database import Base
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    categories = relationship(
        "Category",
        back_populates="owner",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )

    owner = relationship("User", back_populates="categories")
    documents = relationship(
        "Document",
        back_populates="category",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    quizzes = relationship(
        "Quiz",
        back_populates="category",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    quiz_attempts = relationship(
        "QuizAttempt",
        back_populates="category",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True, nullable=False)
    path = Column(String(512), index=True, nullable=False)
    category_id = Column(
        Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False
    )

    category = relationship("Category", back_populates="documents")


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    level = Column(String(10), nullable=False)
    path = Column(String(512), index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    category_id = Column(
        Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False
    )

    category = relationship("Category", back_populates="quizzes")


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(
        Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False
    )
    submitted_at = Column(DateTime, default=datetime.utcnow)
    path = Column(String(512), nullable=False)

    category = relationship("Category", back_populates="quiz_attempts")
