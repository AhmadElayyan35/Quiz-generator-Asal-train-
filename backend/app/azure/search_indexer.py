import json
from typing import Any

import requests
from app.config import KeyVault
from app.utils.files_loader import load_file


class Indexer:
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

    def create_indexer(
        self, indexer_name: str, datasource_name: str, target_index_name: str
    ):
        schema_path = load_file("schemas", "indexer.json")
        with open(schema_path, encoding="utf-8") as fp:
            schema: dict[str, Any] = json.load(fp)

        schema["name"] = indexer_name
        schema["dataSourceName"] = datasource_name
        schema["targetIndexName"] = target_index_name

        url = f"{self.__endpoint}/indexers/{indexer_name}"
        resp = requests.put(
            url,
            headers=self.__headers,
            params={"api-version": self.__api_version},
            json=schema,
        )
        self.__check(resp, f"create indexer '{indexer_name}'")

    def delete_indexer(self, indexer_name: str):
        url = f"{self.__endpoint}/indexers/{indexer_name}"
        resp = requests.delete(
            url, headers=self.__headers, params={"api-version": self.__api_version}
        )
        if resp.status_code not in (200, 204, 404):
            self.__check(resp, f"delete indexer '{indexer_name}'")

    def run_indexer(self, indexer_name: str):
        url = f"{self.__endpoint}/indexers/{indexer_name}/run"
        resp = requests.post(
            url, headers=self.__headers, params={"api-version": self.__api_version}
        )
        self.__check(resp, f"run indexer '{indexer_name}'")

    def get_status(self, indexer_name: str):
        url = f"{self.__endpoint}/indexers/{indexer_name}/status"
        resp = requests.get(
            url, headers=self.__headers, params={"api-version": self.__api_version}
        )
        self.__check(resp, f"get status for '{indexer_name}'")
        data = resp.json() or {}

        lr = data.get("lastResult")
        if isinstance(lr, dict) and lr.get("status"):
            return lr["status"]

        if data.get("status"):
            return data["status"]

        raise RuntimeError(f"No runnable status in response: {data!r}")

    @staticmethod
    def __check(resp: requests.Response, action: str):
        if not resp.ok:
            raise RuntimeError(f"Failed to {action}: {resp.status_code} – {resp.text}")
