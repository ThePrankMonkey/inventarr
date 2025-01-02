import logging
import os

from pydantic_settings import BaseSettings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

current_directory = os.path.dirname(os.path.abspath(__file__))


class Settings(BaseSettings):
    app_name: str = "Inventarr"
    database_url: str
    storage_path: str
    thumbnail_size: tuple = (75, 75)
    qr_scale: int = 3
    printer_min_label_width_inches: float = 0
    printer_max_label_width_inches: float = 2.4
    printer_min_label_height_inches: float = 0
    printer_max_label_height_inches: float = 2.4
    printer_dpi: int = 300
    font_path: str = os.path.abspath(
        os.path.join(
            current_directory,
            "../fonts",
        )
    )
    label_font_path: str = os.path.join(font_path, "FreeMonoBold.ttf")


class TestSettings(Settings):
    stage: str = "test"
    database_url: str = ""


class DevSettings(Settings):
    stage: str = "dev"
    database_url: str = "sqlite:///database.db"
    storage_path: str = os.path.abspath(
        os.path.join(
            current_directory,
            "../photos",
        )
    )


class ProdSettings(Settings):
    stage: str = "prod"
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
