# Inventarr

This is an inventory management system for tracking details on my components, tools, ingredients, etc.

I recently ran into two problems:

- I couldn't find a component I knew I had.
- I ordered redundant components that I had forgotten I had.

This is wasteful. I need a better way to track what I have and therefore what I need.

I intend to share this inventory management system with a Project Tracker and Recipe List project I'm working on next.

I consider items to be in a hierarchy of locations. Rooms have Chests. Chests have Pockets. Pockets have Items. I needed, I could expand this to Buildings have Rooms, but I don't need to go that far at this time for a personal inventory management tool.

I'm also considering this to be a fun way to practice some React.

## Road Map

- [x] Basic Backend
  - [x] CRUD for Rooms
  - [x] CRUD for Chests
  - [x] CRUD for Pocketss
  - [x] CRUD for Items
- [ ] Basic Frontend
  - [ ] Add Banner to shoot updates to
  - [x] View
  - [x] Create
    - [ ] TODO: Add information to banner
  - [x] Modify
    - [x] TODO: Support Item Types in Modify Item
    - [ ] TODO: Add information to banner
  - [x] Delete
    - [x] TODO: Refresh ListX Components after clicking Delete
    - [ ] TODO: Add information to banner
  - [x] Share Data via Env Var and Config
- [ ] Advanced Backend
  - [x] Upload/Retrieve images on Items
    - [ ] TODO: Route for getting thumbnails, maybe add a query to /photo
  - [x] Create Thumbnails
  - [x] Copy Chests (Create a duplicate with same count and types of pockets, but new ids)
  - [ ] Support Labels
    - [x] Generate QR Code
      - [x] QR Code is stringified JSON like `{ "type": "item", "id": 1 }`
    - [x] Generate Message
    - [x] Handle min/max for labels
    - [ ] Handle text resizing
  - [x] Support Inventory Checking
    - [x] New route that takes in the scan of a qr and returns full data
      - [x] Data will be different for different types
  - [ ] Search fields in Tables
    - [x] Search Items
    - [ ] Search Pockets, useful???
    - [ ] Search Chests, useful???
    - [ ] Search Rooms, useful???
  - [x] Consume Items
    - [x] Unit conversion (useful for ingredients)
  - [ ] ???
- [ ] Advanced Frontend
  - [x] Show photos in table
  - [x] Search fields in tables
    - [x] TODO: Why do some images not update between searches? (Issue was table used index as key instead of item id)
  - [ ] Sortable table
  - [ ] Inventory checks
  - [ ] Support Create Thumbnails, meaning use thumbnails instead of full images
  - [ ] Support Copy Chests
  - [x] Support Labels
    - [x] Update Create
    - [x] Update Modify
    - [x] Handle min/max for labels
      - [ ] Should height be unbounded?
  - [x] Support Inventory Checking
    - [x] New page that has an input for the value of a qrcode
      - [x] Will display data differently depending on the type
      - [x] Will select the input so a new entry will override and kick off new data pull
  - [ ] ???

### Extra Features

- [ ] Increase test coverage to 80% for backend and frontend
- [ ] Add Auth
  - [ ] Research sidecar vs middleware
- [x] Use/Restock
  - [x] Work on Unit Conversions
  - [x] Use Ingredients/Components
  - [x] Restock Ingredients/Components
- [ ] Integrate Barcode Printer
  - [ ] Research Printers
    - https://www.brother-usa.com/products/ql600 ???
  - [x] Create Labels
- [ ] Integrate Barcode Scanner
  - [ ] Research Scanners
    - https://www.amazon.com/Tera-Wireless-Charging-Handheld-Automatic/dp/B07KZLK5WY
- [ ] Load Item data from barcode?
  - https://go-upc.com/plans/api
  - https://www.upcitemdb.com/upc/38000001277
  - https://devs.upcitemdb.com/
- [ ] Include Item Category??? How deep should I take that?
- [ ] Include Item Brand??? Maybe just toss that under Notes?
- [ ] Should ItemTypes be different Models?
