from app.azure.conn_string_database import get_azure_sql_string
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLAlchemy engine setup
AZURE_SQL_CONNECTION_STRING = get_azure_sql_string()
SQLALCHEMY_DATABASE_URL = f"mssql+pyodbc:///?odbc_connect={AZURE_SQL_CONNECTION_STRING}"
engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)

# Session configuration
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
