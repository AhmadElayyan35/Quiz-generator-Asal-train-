import json
from typing import Any

import requests
from app import constants
from app.config import KeyVault
from app.utils.files_loader import load_file


class DataSource:
    def __init__(self):
        self.__service_name = constants.AZURE_COG_SEARCH_NAME
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

    def create_datasource(self, datasource_name: str, container_path: str):
        schema_path = load_file("schemas", "datasource.json")
        with open(schema_path, encoding="utf-8") as fp:
            schema: dict[str, Any] = json.load(fp)

        schema["name"] = datasource_name
        schema.setdefault("container", {})
        schema["container"]["name"] = schema["container"].get("name")
        schema["container"]["query"] = container_path
        schema["credentials"]["connectionString"] = KeyVault.AZURE_SEARCH_DS_CONNSTR

        url = f"{self.__endpoint}/datasources/{datasource_name}"
        resp = requests.put(
            url,
            headers=self.__headers,
            params={"api-version": self.__api_version},
            json=schema,
        )
        self.__check(resp, f"create data source '{datasource_name}'")

    def delete_datasource(self, datasource_name: str):
        url = f"{self.__endpoint}/datasources/{datasource_name}"
        resp = requests.delete(
            url,
            headers=self.__headers,
            params={"api-version": self.__api_version},
        )
        if resp.status_code not in (200, 204, 404):
            self.__check(resp, f"delete data source '{datasource_name}'")

    @staticmethod
    def __check(resp: requests.Response, action: str):
        if not resp.ok:
            raise RuntimeError(f"Failed to {action}: {resp.status_code} – {resp.text}")
