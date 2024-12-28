import logging
import os

from pydantic_settings import BaseSettings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    app_name: str = "Inventarr"
    database_url: str
    storage_path: str
    thumbnail_size: tuple = (75,75)
    max_label_width_inches: float = 2.5


class TestSettings(Settings):
    database_url: str = ""


class DevSettings(Settings):
    database_url: str = "sqlite:///database.db"
    current_directory:str = os.path.dirname(os.path.abspath(__file__))
    storage_path: str = os.path.abspath(os.path.join(
        current_directory,
        "../photos",
    ))

class ProdSettings(Settings):
    database_url: str = ""


stage = os.environ.get("BE_STAGE", "dev")
if stage == "test":
    logger.info("Loading TestSettings")
    raise (Exception("Test stage not yet configured"))
    settings = TestSettings()
elif stage == "dev":
    logger.info("Loading DevSettings")
    settings = DevSettings()
elif stage == "prod":
    logger.info("Loading ProdSettings")
    raise (Exception("Prod stage not yet configured"))
    settings = ProdSettings()
