import os

from azure.storage.blob import BlobServiceClient
from config import COMPONENTS_FOLDER, CONTAINER_NAME
from dotenv import load_dotenv

load_dotenv()
STORAGE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONN")


def export_blob_files():
    print(f"📦 Exporting blobs from container '{CONTAINER_NAME}'...")
    os.makedirs(COMPONENTS_FOLDER, exist_ok=True)

    client = BlobServiceClient.from_connection_string(
        STORAGE_CONNECTION_STRING
    ).get_container_client(CONTAINER_NAME)
    for blob in client.list_blobs():
        path = os.path.join(COMPONENTS_FOLDER, blob.name)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "wb") as f:
            f.write(client.download_blob(blob.name).readall())
        print(f"✅ Downloaded blob: {blob.name} → {path}")


def create_blob_container():
    service_client = BlobServiceClient.from_connection_string(STORAGE_CONNECTION_STRING)
    try:
        service_client.create_container(CONTAINER_NAME)
        print(f"✅ Created blob container: {CONTAINER_NAME}")
    except Exception as e:
        print(f"⚠️ Container might already exist: {e}")
