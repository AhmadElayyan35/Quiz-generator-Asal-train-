from app.azure.conn_string_database import get_azure_sql_string
from app.models.db_models import Base
from sqlalchemy import create_engine

# Create the connection engine to Azure SQL database
AZURE_SQL_CONNECTION_STRING = get_azure_sql_string()
engine = create_engine(f"mssql+pyodbc:///?odbc_connect={AZURE_SQL_CONNECTION_STRING}")

# Create the tables in Azure SQL database using the enginge created
# This will create a table for each model that inherits from Base
Base.metadata.create_all(engine)
print("Success! Created all tables in the DB.")


# To run this script
# Change to the backend directory
# python -m app.database.create_tables_database
