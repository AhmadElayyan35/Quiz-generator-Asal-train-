import json
import re
import time
import uuid

from app.azure.openAI_generator import generate_quiz_from_index
from app.azure.search_datasource import DataSource
from app.azure.search_index import Index
from app.azure.search_indexer import Indexer
from app.models.db_models import Category
from app.schemas.question_schema import QuestionRegen, QuestionSchema, QuizGenerateOut
from app.schemas.quiz_schema import QuizForm
from fastapi import HTTPException


def run_indexer(indexer: Indexer, name: str):
    status = indexer.get_status(name)
    while status.lower() in ("running", "inprogress"):
        time.sleep(5)
        status = indexer.get_status(name)
    indexer.run_indexer(name)
    status = indexer.get_status(name)
    while status.lower() in ("running", "inprogress"):
        time.sleep(5)
        status = indexer.get_status(name)


def clean_quiz(quiz_json):
    cleaned = re.sub(r"^```(?:json)?\s*\n?", "", quiz_json)
    cleaned = re.sub(r"\n?```$", "", cleaned)
    return cleaned


def create_quiz(category: Category, data: QuizForm):
    suffix = uuid.uuid4().hex
    index_name = f"{data.name}-{suffix}".replace(" ", "").lower()
    datasource_name = f"ds-{suffix}"
    indexer_name = f"indexer-{suffix}"
    index, ds, indexer = Index(), DataSource(), Indexer()
    documents_path = f"{category.owner.name}/{category.name}/documents".replace(
        " ", "_"
    )
    try:
        index.create_index(index_name)
        ds.create_datasource(
            datasource_name,
            container_path=documents_path,
        )
        indexer.create_indexer(indexer_name, datasource_name, index_name)
        run_indexer(indexer, indexer_name)
        quiz_json = generate_quiz_from_index(index_name, data.level)
        cleaned = clean_quiz(quiz_json)
        quiz_list = json.loads(cleaned)
        return QuizGenerateOut(
            index_name=index_name,
            questions=[QuestionSchema(**q) for q in quiz_list],
        )

    finally:
        for function, name in (
            (indexer.delete_indexer, indexer_name),
            (ds.delete_datasource, datasource_name),
        ):
            try:
                function(name)
            except Exception:
                pass


def begin_quiz(indexName: str):
    try:
        Index().delete_index(indexName)
    except Exception as e:
        print(f"Warning: failed to delete index {indexName}: {e}")


def change_question(data: QuestionRegen):
    existing = [q.dict() for q in data.questions]

    raw = generate_quiz_from_index(
        index_name=data.index_name,
        difficulty=data.difficulty,
        question_number=data.question_number - 1,
        existing_questions=existing,
        user_prompt=data.user_prompt,
    )
    cleaned = clean_quiz(raw)
    try:
        regen_list = json.loads(cleaned)

    except json.JSONDecodeError as e:
        snippet = cleaned[:200].replace("\n", "\\n")
        raise HTTPException(
            status_code=502,
            detail=f"Invalid JSON: {e.msg} at {e.pos}. Snippet: {snippet}",
        )

    if len(regen_list) != 1:
        raise HTTPException(
            status_code=502, detail="Expected exactly one question back."
        )

    return QuestionSchema(**regen_list[0])
