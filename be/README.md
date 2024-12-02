## Fill in test data

```bash
http POST http://127.0.0.1:5123/rooms name=Office location="Office Room"
http POST http://127.0.0.1:5123/rooms name=Kitchen location="Kitchen Room"

http POST http://127.0.0.1:5123/chests name="Component 1" room_id=1
http POST http://127.0.0.1:5123/chests name="Pantry" room_id=2


http POST http://127.0.0.1:5123/pockets name="Drawer A1" location="A1" chest_id=1
http POST http://127.0.0.1:5123/pockets name="Shelf 1" location="Shelf 1" chest_id=2


http POST http://127.0.0.1:5123/items name="WaveShare 2.7in EPaper Display" pocket_id=1 quantity=1
http POST http://127.0.0.1:5123/items name="All Purpose Flour" pocket_id=2 quantity=2
```

## Cehck test Data

```bash
http GET http://127.0.0.1:5123/rooms/1/chests
```
