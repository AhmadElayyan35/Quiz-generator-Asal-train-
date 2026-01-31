import json
from typing import Any
from urllib.parse import unquote, urlparse

from app import constants
from app.config import KeyVault
from azure.core.exceptions import ResourceNotFoundError
from azure.storage.blob import BlobServiceClient, ContentSettings
from fastapi import HTTPException


class AzureBlobStorage:
    def __init__(self):
        self.__account_name = constants.STORAGE_ACCOUNT_NAME
        self.__account_key = KeyVault.STORAGE_ACCOUNT_KEY
        self.__container_name = constants.CONTAINER_NAME

        if (
            not self.__account_name
            or not self.__account_key
            or not self.__container_name
        ):
            raise ValueError(
                "Missing Azure storage configuration in environment variables."
            )

        connection_string = (
            f"DefaultEndpointsProtocol=https;"
            f"AccountName={self.__account_name};"
            f"AccountKey={self.__account_key};"
            f"EndpointSuffix=core.windows.net"
        )

        self.blob_service_client = BlobServiceClient.from_connection_string(
            connection_string
        )
        self.container_client = self.blob_service_client.get_container_client(
            self.__container_name
        )

    def upload_file(self, file, filename: str):
        try:
            blob_client = self.container_client.get_blob_client(filename)

            blob_client.upload_blob(
                file.file,
                overwrite=True,
                content_settings=ContentSettings(content_type=file.content_type),
            )

            return blob_client.url

        except Exception as e:
            print("Error uploading file:", e)
            raise HTTPException(
                status_code=500, detail="Failed to upload file to storage."
            )

    def upload_quiz(self, data: bytes, filename: str):
        try:
            blob_client = self.container_client.get_blob_client(filename)
            blob_client.upload_blob(
                data,
                overwrite=True,
                content_settings=ContentSettings(content_type="application/json"),
            )
            return blob_client.url
        except Exception as e:
            print("Error uploading quiz:", e)
            raise HTTPException(
                status_code=500, detail="Failed to upload quiz to storage."
            )

    def delete_blob(self, path: str, is_full: bool = False):
        try:
            if is_full:
                parsed = urlparse(path)
                container, _, blob_path = parsed.path.lstrip("/").partition("/")
                if container != self.container_client.container_name:
                    raise HTTPException(status_code=400, detail="Container mismatch")
            else:
                blob_path = path.lstrip("/")

            self.container_client.delete_blob(blob_path)

        except ResourceNotFoundError:
            raise HTTPException(status_code=404, detail="Blob not found")
        except Exception as e:
            print("Error deleting blob:", e)
            raise HTTPException(
                status_code=500, detail="Failed to delete file from storage"
            )

    def retrieve_blob(self, path: str):
        try:
            blob_path_inside_container = unquote("/".join(path.split("/")[-4:]))
            blob_client = self.container_client.get_blob_client(
                blob_path_inside_container
            )

            stream = blob_client.download_blob()
            content = stream.readall().decode("utf-8")
            return json.loads(content)

        except Exception as e:
            print(f"Error retrieving blob '{path}' from Azure:", e)
            raise HTTPException(
                status_code=500, detail="Failed to retrieve file from storage."
            )

    def upload_json(self, payload: Any, filename: str):
        data = json.dumps(payload).encode("utf-8")
        blob_client = self.container_client.get_blob_client(filename)

        blob_client.upload_blob(
            data,
            overwrite=True,
            content_settings=ContentSettings(content_type="application/json"),
        )

        return blob_client.url
