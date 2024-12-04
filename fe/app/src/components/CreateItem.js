import React, { useState, useEffect } from "react";

import ListItemTypes from "./ListItemTypes";
import ListRooms from "./ListRooms";
import ListRoomChests from "./ListRoomChests";
import ListChestPockets from "./ListChestPockets";

const CreateItem = () => {
  const [itemType, setItemType] = useState("");
  const [roomId, setRoomId] = useState("");
  const [chestId, setChestId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    item_type: "",
    pocket_id: "",
    chest_id: "",
    room_id: "",
    quantity: 0,
    upc: "",
    notes: "",
  });

  const bubbleUpItemTypes = (value) => {
    setItemType(value);
    setFormData({
      ...formData,
      item_type: value,
    });
  };
  const bubbleUpRooms = (value) => {
    setRoomId(value);
    setFormData({
      ...formData,
      room_id: value,
    });
  };
  const bubbleUpRoomChests = (value) => {
    setChestId(value);
    setFormData({
      ...formData,
      chest_id: value,
    });
  };
  const bubbleUpChestPockets = (value) => {
    setFormData({
      ...formData,
      pocket_id: value,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = formData;
      console.log("Sending Payload: ", payload);
      const response = await fetch(`http://127.0.0.1:5123/items/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log(response.json());
      //TODO Update Banner
      //TODO Clear some fields like name, quantity, UPC, and notes. Leave room/chest/pocket.
    } catch (error) {
      // Handle errors (e.g., display an error message)
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <h1>Create a new Item</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter a name:
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
          />
        </label>
        <label>
          Select a room:
          <ListItemTypes bubbleUp={bubbleUpItemTypes} />
        </label>
        <label>
          Enter a quantity:
          <input
            type="text"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({
                ...formData,
                quantity: e.target.value,
              })
            }
          />
        </label>
        <label>
          Select a room:
          <ListRooms bubbleUp={bubbleUpRooms} />
        </label>
        <label>
          Select a chest:
          {roomId ? (
            <ListRoomChests bubbleUp={bubbleUpRoomChests} roomId={roomId} />
          ) : (
            <p>"Please select a room first"</p>
          )}
        </label>
        <label>
          Select a pocket:
          {chestId ? (
            <ListChestPockets
              bubbleUp={bubbleUpChestPockets}
              chestId={chestId}
            />
          ) : (
            <p>"Please select a chest first"</p>
          )}
        </label>
        <label>
          Enter a UPC:
          <input
            type="text"
            value={formData.upc}
            onChange={(e) =>
              setFormData({
                ...formData,
                upc: e.target.value,
              })
            }
          />
        </label>
        <label>
          Enter notes:
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({
                ...formData,
                notes: e.target.value,
              })
            }
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default CreateItem;
