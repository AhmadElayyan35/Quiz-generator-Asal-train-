import json
from typing import Any

import requests
from app.config import KeyVault
from app.utils.files_loader import load_file


class Index:
    def __init__(self):
        self.__service_name = KeyVault.AZURE_COG_SEARCH_NAME
        self.__admin_key = KeyVault.AZURE_COG_SEARCH_ADMIN_KEY
        self.__api_version = "2023-10-01-Preview"

        if not self.__service_name or not self.__admin_key:
            raise ValueError(
                "AZURE_COG_SEARCH_NAME and AZURE_COG_SEARCH_ADMIN_KEY must be set"
            )

        self.__endpoint = f"https://{self.__service_name}.search.windows.net"
        self.__headers = {
            "Content-Type": "application/json",
            "api-key": self.__admin_key,
        }

    def create_index(self, index_name: str):
        schema_path = load_file("schemas", "index.json")
        try:
            with open(schema_path, encoding="utf-8") as fp:
                schema: dict[str, Any] = json.load(fp)
            schema["name"] = index_name
        except FileNotFoundError as err:
            raise FileNotFoundError(f"Schema file not found: {schema_path}") from err

        url = f"{self.__endpoint}/indexes/{index_name}"
        resp = requests.put(
            url,
            headers=self.__headers,
            params={"api-version": self.__api_version},
            json=schema,
        )
        self.__check(resp, f"create index '{index_name}'")

    def delete_index(self, index_name: str):
        url = f"{self.__endpoint}/indexes/{index_name}"
        resp = requests.delete(
            url,
            headers=self.__headers,
            params={"api-version": self.__api_version},
        )
        if resp.status_code not in (200, 204, 404):
            self.__check(resp, f"delete index '{index_name}'")

    def retrieve_documents(self, index_name: str):
        url = f"{self.__endpoint}/indexes/{index_name}/docs"
        params = {
            "api-version": self.__api_version,
            "search": "*",
            "$top": 1000,
        }
        resp = requests.get(url, headers=self.__headers, params=params)
        self.__check(resp, f"retrieve documents from '{index_name}'")
        return resp.json().get("value", [])

    @staticmethod
    def __check(resp: requests.Response, action: str):
        if not resp.ok:
            raise RuntimeError(f"Failed to {action}: {resp.status_code} – {resp.text}")
