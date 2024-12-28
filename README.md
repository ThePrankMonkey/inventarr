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
  - [x] View
  - [x] Create
  - [ ] Modify
  - [ ] Delete
  - [x] Share Data via Env Var and Config
- [ ] Advanced Backend
  - [x] Upload/Retrieve images on Items
  - [x] Create Thumbnails
  - [x] Copy Chests (Create a duplicate with same count and types of pockets, but new ids)
  - [ ] ???
- [ ] Advanced Frontend
  - [x] Show photos in table
  - [ ] Search fields in tables
  - [ ] Sortable table
  - [ ] Inventory checks
  - [ ] Support Create Thumbnails
  - [ ] Support Copy Chests
  - [ ] ???
- [ ] Use/Restock
  - [ ] Work on Unit Conversions
  - [ ] Use Ingredients/Components
  - [ ] Restock Ingredients/Components
- [ ] Integrate Barcode Printer
  - https://www.brother-usa.com/products/ql600 ???
  - [ ] Create Labels
- [ ] Integrate Barcode Scanner
