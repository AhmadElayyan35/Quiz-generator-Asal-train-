import json
import os

import requests
from config import API_VERSION, COMPONENTS_FOLDER, SEARCH_NAME, SKILLSET_NAME
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("AZURE_SEARCH_API_KEY")
HEADERS = {"api-key": API_KEY, "Content-Type": "application/json"}


def export_skillset():
    url = f"https://{SEARCH_NAME}.search.windows.net/indexes/{SKILLSET_NAME}?api-version={API_VERSION}"
    request = requests.get(url, headers=HEADERS)

    if request.ok:
        os.makedirs(COMPONENTS_FOLDER, exist_ok=True)

        with open(
            f"{COMPONENTS_FOLDER}/{SKILLSET_NAME}.json", "w", encoding="utf-8"
        ) as f:
            json.dump(request.json(), f, indent=2)

        print(f"✅ Exported skillset → {SKILLSET_NAME}.json")
    else:
        print(f"❌ Failed to export skillset: {request.status_code}")


def import_skillset():
    path = f"{COMPONENTS_FOLDER}/{SKILLSET_NAME}.json"

    if not os.path.exists(path):
        print(f"❌ File not found: {path}")
        return

    with open(path, encoding="utf-8") as f:
        body = json.load(f)

    url = f"https://{SEARCH_NAME}.search.windows.net/indexes/{SKILLSET_NAME}?api-version={API_VERSION}"
    request = requests.put(url, headers=HEADERS, json=body)

    if request.status_code in (200, 201, 204):
        print(f"✅ Imported skillset → {SKILLSET_NAME}")
    else:
        print(f"❌ Failed to import skillset: {request.status_code}")
        print(request.text)
