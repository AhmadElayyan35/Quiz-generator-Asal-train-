import logging

from app.config import KeyVault
from azure.monitor.opentelemetry import configure_azure_monitor

configure_azure_monitor(connection_string=KeyVault.LOG_CONNECTION)

quiz_logger = logging.getLogger("quiz_logger")
quiz_logger.setLevel(logging.INFO)

if not quiz_logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        "%(asctime)s - QUIZ_LOG - %(levelname)s - %(message)s"
    )
    handler.setFormatter(formatter)
    quiz_logger.addHandler(handler)
