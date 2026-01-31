import os
import zipfile

import requests
from config import FUNCTION_APP_NAME, ZIP_DIR_PATH, ZIP_FILE_PATH
from dotenv import load_dotenv

load_dotenv()
USERNAME = os.getenv("PUBLISH_PROFILE_USER")
PASSWORD = os.getenv("PUBLISH_PROFILE_PASS")


def zip_function_code():
    print(f"📦 Zipping function code from {ZIP_DIR_PATH}...")

    with zipfile.ZipFile(ZIP_FILE_PATH, "w") as zipf:
        for root, _, files in os.walk(ZIP_DIR_PATH):
            for file in files:
                path = os.path.join(root, file)
                arcname = os.path.relpath(path, ZIP_DIR_PATH)
                zipf.write(path, arcname)

    print(f"✅ Zipped to {ZIP_FILE_PATH}")


def deploy_function_app():
    print(f"☁️ Deploying function app: {FUNCTION_APP_NAME}...")
    kudu_url = f"https://{FUNCTION_APP_NAME}.scm.azurewebsites.net/api/zipdeploy"

    with open(ZIP_FILE_PATH, "rb") as zip_file:
        response = requests.post(
            kudu_url,
            auth=(USERNAME, PASSWORD),
            headers={"Content-Type": "application/zip"},
            data=zip_file,
        )

    if response.status_code in (200, 202):
        print("✅ Deployment successful.")
        os.remove(ZIP_FILE_PATH)
        print(f"🗑️ Deleted temporary zip: {ZIP_FILE_PATH}")
    else:
        print(f"❌ Deployment failed: {response.status_code}")
        print(response.text)
