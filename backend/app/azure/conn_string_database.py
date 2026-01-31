from app import constants
from app.config import KeyVault


def get_azure_sql_string():
    # Load the enviromental variables
    DB_USERNAME = constants.DB_USERNAME
    DB_PASSWORD = KeyVault.DB_PASSWORD
    DB_NAME = constants.DB_NAME
    DB_SERVER_NAME = constants.DB_SERVER_NAME

    # Create the Azure SQL database connection string
    AZURE_SQL_CONNECTION_STRING = (
        f"Driver={{ODBC Driver 18 for SQL Server}};Server=tcp:{DB_SERVER_NAME},1433;"
        f"Database={DB_NAME};Uid={DB_USERNAME};Pwd={DB_PASSWORD};Encrypt=yes;"
        f"TrustServerCertificate=no;Connection Timeout=30;"
    )

    return AZURE_SQL_CONNECTION_STRING
