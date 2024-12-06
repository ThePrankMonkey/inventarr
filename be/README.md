# Notes for Inventarr Backend

## Play with API

### Fill in test data

```bash
http POST http://127.0.0.1:5123/rooms name=Office location="Office Room"
http POST http://127.0.0.1:5123/rooms name=Kitchen location="Kitchen Room"

http POST http://127.0.0.1:5123/chests name="Component 1" room_id=1
http POST http://127.0.0.1:5123/chests name="Pantry" room_id=2


http POST http://127.0.0.1:5123/pockets name="Drawer A1" location="A1" room_id=1 chest_id=1
http POST http://127.0.0.1:5123/pockets name="Shelf 1" location="Shelf 1" room_id=2 chest_id=2


http POST http://127.0.0.1:5123/items name="WaveShare 2.7in EPaper Display" item_type="component" room_id=1 chest_id=1 pocket_id=1 quantity=1
http POST http://127.0.0.1:5123/items name="All Purpose Flour" item_type="ingredient" room_id=2 chest_id=2 pocket_id=2 quantity=2
```

### Check the test data

```bash
http GET http://127.0.0.1:5123/rooms/1/chests
http GET http://127.0.0.1:5123/rooms
http GET http://127.0.0.1:5123/chests
http GET http://127.0.0.1:5123/pockets
http GET http://127.0.0.1:5123/items
```

## Issues

### How to do a migration with SQLModel?

Found a [lovely guide](https://medium.com/@kasperjuunge/how-to-get-started-with-alembic-and-sqlmodel-288700002543) for using Alembic with SQLModel.

I should just need to update `./be/migrations/env.py` with any additional models (just the ones with `table=True`) I want to track with Alembic. Then when I make changes, I can run the following commands to perform a migration.

```bash
docker compose exec be alembic revision --autogenerate -m "SOME_MESSAGE"
docker compose exec be alembic upgrade head
```

I'll dabble with a `.envrc` function.

```bash
function migrate(){
    docker compose exec be alembic revision --autogenerate -m "$1"
    docker compose exec be alembic upgrade head
}
```

In case things get deleted, these are the steps I took:

1. Install Alembic, `docker compose exec be poetry add alembic`.
2. Initialise Alembic, `docker compose exec be alembic init migrations`.
3. Edit `alembic.ini` with `sqlalchemy.url = sqlite:///database.db` (or whatever connection string I make for Postgres later on)
4. Edit `env.py` with the following:

   - ```python
        from sqlmodel import SQLModel
        from alembic import context
        from models import *  # Import your SQLModel models here

        target_metadata = SQLModel.metadata
     ```

5. Edit `script.py.mako` with `import sqlmodel`. I put mine near `import sqlalchemy`.
