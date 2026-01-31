from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient


class KeyVaultVars:
    def __init__(self, vault_name: str):
        print("Loading secrets from Azure Key Vault")
        self.vault_url = f"https://{vault_name}.vault.azure.net/"
        self.credential = DefaultAzureCredential()
        self.client = SecretClient(vault_url=self.vault_url, credential=self.credential)

        self.STORAGE_ACCOUNT_KEY = self._get_secret("STORAGE-ACCOUNT-KEY")
        self.DB_PASSWORD = self._get_secret("DB-PASSWORD")
        self.SECRET_KEY = self._get_secret("SECRET-KEY")
        self.ALGORITHM = self._get_secret("ALGORITHM")
        self.AZURE_COG_SEARCH_NAME = self._get_secret("AZURE-COG-SEARCH-NAME")
        self.AZURE_COG_SEARCH_ADMIN_KEY = self._get_secret("AZURE-COG-SEARCH-ADMIN-KEY")
        self.AZURE_SEARCH_DS_CONNSTR = self._get_secret("AZURE-SEARCH-DS-CONNSTR")
        self.AZURE_OPENAI_API_KEY = self._get_secret("AZURE-OPENAI-API-KEY")
        self.CONTAINER_REGISTRY_USERNAME = self._get_secret(
            "CONTAINER-REGISTRY-USERNAME"
        )
        self.CONTAINER_REGISTRY_PASSWORD = self._get_secret(
            "CONTAINER-REGISTRY-PASSWORD"
        )
        self.LOG_CONNECTION = self._get_secret("LOG-CON")

    def _get_secret(self, name: str, quote=False) -> str:
        value = self.client.get_secret(name).value
        return f'"{value}"' if quote else value


KeyVault = KeyVaultVars(vault_name="quizgen-key")
