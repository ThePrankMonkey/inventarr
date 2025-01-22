import argparse
import logging
import subprocess
import sys

from sqlmodel import Session, SQLModel

from app.config import settings
from app.db import engine
from app.helpers.label_maker import make_label
from app.models.room.model import Room
from app.models.chest.model import Chest
from app.models.pocket.model import Pocket
from app.models.item.model import Item

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AssetTypes:
    ASSET_ROOM = "room"
    ASSET_CHEST = "chest"
    ASSET_POCKET = "pocket"


class PrintJob:
    def __init__(self, width, height, file_path, asset):
        self.width = width
        self.height = height
        self.file_path = file_path
        self.asset = asset

    def __repr__(self):
        return f"JOB: {self.asset.__tablename__}/{self.asset.id}, {self.width}x{self.height} at {self.file_path}"


ASSET_CHOICES = [
    AssetTypes.ASSET_ROOM,
    AssetTypes.ASSET_CHEST,
    AssetTypes.ASSET_POCKET,
]


def get_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Print off label(s)")
    # Add arguments
    parser.add_argument(
        "-a",
        "--asset_type",
        choices=ASSET_CHOICES,
        help="The type of label to print",
        required=True,
    )
    parser.add_argument(
        "-i",
        "--asset_id",
        type=int,
        help="The id of the label to print",
        required=True,
    )
    parser.add_argument(
        "-r",
        "--recursive",
        action="store_true",
        help="Whether to print all sub labels as well",
    )
    parser.add_argument(
        "-d",
        "--demo",
        action="store_true",
        help="Flag for whether to demo (do everything except really send print jobs)",
    )
    # Parse arguments
    args = parser.parse_args()
    logger.info(args)
    return args


def print_labels(print_job: PrintJob, demo: bool):
    logger.info(f"Printing: {print_job}")
    commands = [
        "lp",
        "-d",
        settings.printer_name,
        "-o",
        f"media=Custom.{print_job.width}x{print_job.height}in",
        print_job.file_path,
    ]
    logger.info(f"SENDING PRINT JOB: {print_job}")
    if not demo:
        subprocess.run(
            commands, check=True
        )  # TODO commenting out so I don't waste paper...
        # TODO: I could capture the STDOUT and find the printjob...


def main():
    # Handle arguments
    args = get_arguments()
    asset_type = args.asset_type
    asset_id = args.asset_id
    recursive = args.recursive
    demo = args.demo

    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        assets = []
        match asset_type:
            case AssetTypes.ASSET_ROOM:
                asset = session.get(Room, asset_id)
                logger.info(f"Room asset: {asset}")
            case AssetTypes.ASSET_CHEST:
                asset = session.get(Chest, asset_id)
                logger.info(f"Chest asset: {asset}")
                assets.append(asset)
            case AssetTypes.ASSET_POCKET:
                asset = session.get(Pocket, asset_id)
                logger.info(f"Pocket asset: {asset}")
                assets.append(asset)
            case _:
                logger.error(f"Invalid type, {asset_type}")
                sys.exit("")
        if recursive:
            if asset_type == AssetTypes.ASSET_ROOM:
                logger.info(
                    f"Room {asset.id} has {len(asset.chests)} chests: {asset.chests}"
                )
                for chest in asset.chests:
                    assets.append(chest)
                    logger.info(
                        f"Chest {chest.id} has {len(chest.pockets)} pockets: {chest.pockets}"
                    )
                    assets.extend(chest.pockets)
            if asset_type == AssetTypes.ASSET_CHEST:
                logger.info(
                    f"Chest {asset.id} has {len(asset.pockets)} pockets: {asset.pockets}"
                )
                assets.extend(asset.pockets)
            if asset_type == AssetTypes.ASSET_POCKET:
                logger.info("Pockets don't need recursion.")
        for i, asset in enumerate(assets, 1):
            logger.info(f"Creating job for {i}/{len(assets)}: {asset}")
            label_path = make_label(
                entry_type=asset.__tablename__,
                entry_id=asset.id,
                width=asset.label_width,
                height=asset.label_height,
                message=asset.name,
            )
            logger.info(f"Label stored at: {label_path}")
            print_job = PrintJob(
                width=settings.printer_max_label_width_inches,
                height=asset.label_height,
                file_path=label_path,
                asset=asset,
            )
            # # TODO: Should I kick off print job immediately? I kind of think I should...
            print_labels(print_job, demo)


if __name__ == "__main__":
    main()
