import json
import os

import requests
from config import API_VERSION, COMPONENTS_FOLDER, DATASOURCE_NAME, SEARCH_NAME
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("AZURE_SEARCH_API_KEY")
AZURE_STORAGE_CONN = os.getenv("AZURE_STORAGE_CONN")
HEADERS = {"api-key": API_KEY, "Content-Type": "application/json"}


def export_datasource():
    url = f"https://{SEARCH_NAME}.search.windows.net/datasources/{DATASOURCE_NAME}?api-version={API_VERSION}"
    request = requests.get(url, headers=HEADERS)

    if request.ok:
        os.makedirs(COMPONENTS_FOLDER, exist_ok=True)
        with open(
            f"{COMPONENTS_FOLDER}/{DATASOURCE_NAME}.json", "w", encoding="utf-8"
        ) as f:
            json.dump(request.json(), f, indent=2)
        print(f"✅ Exported datasource → {DATASOURCE_NAME}.json")
    else:
        print(f"❌ Failed to export datasource: {request.status_code}")
        print(request.text)


def import_datasource():
    path = f"{COMPONENTS_FOLDER}/{DATASOURCE_NAME}.json"

    if not os.path.exists(path):
        print(f"❌ File not found: {path}")
        return

    with open(path, encoding="utf-8") as f:
        body = json.load(f)

    # Ensure credentials are included
    if "credentials" not in body or not body["credentials"].get("connectionString"):
        if not AZURE_STORAGE_CONN:
            print("❌ Missing AZURE_STORAGE_CONN in .env")
            return
        body["credentials"] = {"connectionString": AZURE_STORAGE_CONN}

    url = f"https://{SEARCH_NAME}.search.windows.net/datasources/{DATASOURCE_NAME}?api-version={API_VERSION}"
    request = requests.put(url, headers=HEADERS, json=body)

    if request.status_code in (200, 201, 204):
        print(f"✅ Imported datasource → {DATASOURCE_NAME}")
    else:
        print(f"❌ Failed to import datasource: {request.status_code}")
        print(request.text)
