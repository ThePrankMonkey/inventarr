import argparse
import csv
import datetime
import logging
import os
import sys

from sqlmodel import Session, SQLModel, select

from app.db import engine
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


ASSET_EVERYTHING = "all"

ASSET_CHOICES = [
    AssetTypes.ASSET_ROOM,
    AssetTypes.ASSET_CHEST,
    AssetTypes.ASSET_POCKET,
]


def get_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Export DB to CSVs")
    # Add arguments
    parser.add_argument(
        "-a",
        "--asset_type",
        choices=ASSET_CHOICES + [ASSET_EVERYTHING],
        help=f"The table to export, [{ASSET_EVERYTHING}] will do all tables.",
        required=True,
    )
    # Parse arguments
    args = parser.parse_args()
    logger.info(args)
    return args


def process_csv(
    session: Session,
    model: SQLModel,
    timestamp: datetime.datetime,
):
    table_name = model.__tablename__
    csv_path = f"/src/db_backups/{table_name}-{timestamp}.csv"
    with open(csv_path, "w") as f_obj:
        outcsv = csv.writer(f_obj)
        statement = select(model)
        records = session.exec(statement)
        # Add headers
        outcsv.writerow(model.__table__.columns.keys())
        # Process records
        [
            outcsv.writerow(
                [getattr(curr, column.name) for column in model.__mapper__.columns]
            )
            for curr in records
        ]
    logger.info(f"Exported {table_name} records to {csv_path}")


def main():
    # Handle arguments
    args = get_arguments()
    asset_type = args.asset_type

    # Create a unique id for the CSVs, goign with timestamp
    timestamp = int(datetime.datetime.timestamp(datetime.datetime.now()))

    # process
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        if asset_type in [AssetTypes.ASSET_ROOM, ASSET_EVERYTHING]:
            process_csv(
                session=session,
                model=Room,
                timestamp=timestamp,
            )
        if asset_type in [AssetTypes.ASSET_CHEST, ASSET_EVERYTHING]:
            process_csv(
                session=session,
                model=Chest,
                timestamp=timestamp,
            )
        if asset_type in [AssetTypes.ASSET_POCKET, ASSET_EVERYTHING]:
            process_csv(
                session=session,
                model=Pocket,
                timestamp=timestamp,
            )


if __name__ == "__main__":
    main()
