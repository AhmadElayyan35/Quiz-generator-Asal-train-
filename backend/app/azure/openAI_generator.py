import json
from typing import Any

from app import constants
from app.azure.search_index import Index
from app.config import KeyVault
from app.utils.files_loader import load_file
from openai import AzureOpenAI

AZURE_OPENAI_ENDPOINT = constants.AZURE_OPENAI_ENDPOINT
AZURE_OPENAI_API_KEY = KeyVault.AZURE_OPENAI_API_KEY
AZURE_OPENAI_API_VERSION = constants.AZURE_OPENAI_API_VERSION
AZURE_OPENAI_DEPLOYMENT = constants.AZURE_OPENAI_DEPLOYMENT

SYSTEM_PROMPT_PATH = load_file("prompts", "system.txt")
GENERATION_PROMPT_PATH = load_file("prompts", "generation.txt")


def generate_quiz_from_index(
    index_name: str,
    difficulty: str,
    question_number: int | None = None,
    existing_questions: list[dict[str, Any]] | None = None,
    user_prompt: str | None = None,
):
    search_client = Index()
    docs = search_client.retrieve_documents(index_name)

    all_chunks = []
    for doc in docs:
        for chunk_json in doc.get("extractedChunks", []):
            try:
                obj = json.loads(chunk_json)
                all_chunks.append(obj.get("chunk", ""))
            except json.JSONDecodeError:
                all_chunks.append(chunk_json)

    summary = "\n\n".join(all_chunks[:20])
    full_text = "\n\n".join(doc.get("content", "") for doc in docs)

    with open(SYSTEM_PROMPT_PATH, encoding="utf-8") as f:
        system_prompt = f.read().strip()
    with open(GENERATION_PROMPT_PATH, encoding="utf-8") as f:
        generation_prompt = f.read().strip()

    regen_block = ""
    if question_number is not None and existing_questions:
        others = [
            q for q in existing_questions if q["question_number"] != question_number
        ]
        regen_block = (
            f"--- Regenerate QUESTION #{question_number} ---\n"
            f"Reason: {user_prompt}\n"
            "Existing questions (do not repeat):\n"
            + "\n".join(f"{q['question_number']}: {q['question']}" for q in others)
            + "\n\n"
        )

    parts = []
    if regen_block:
        parts.append(regen_block)
    parts.append(f"Top keyphrase-matched snippets:\n{summary}\n\n")
    parts.append(f"Full academic content:\n{full_text}\n\n")
    parts.append(f"Difficulty: {difficulty}\n\n")
    parts.append(generation_prompt)
    user_content = "".join(parts)

    client = AzureOpenAI(
        azure_endpoint=AZURE_OPENAI_ENDPOINT,
        api_key=AZURE_OPENAI_API_KEY,
        api_version=AZURE_OPENAI_API_VERSION,
    )
    response = client.chat.completions.create(
        model=AZURE_OPENAI_DEPLOYMENT,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content},
        ],
        max_tokens=2048,
        temperature=0.7,
        top_p=1.0,
        stream=False,
    )
    client.close()
    return response.choices[0].message.content
