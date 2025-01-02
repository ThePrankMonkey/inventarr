import React, { useState, useEffect } from "react";

import ListItemTypes from "./ListItemTypes";
import ListRooms from "./ListRooms";
import ListRoomChests from "./ListRoomChests";
import ListChestPockets from "./ListChestPockets";
import config from "../config";

const CreateItem = () => {
  const [itemType, setItemType] = useState("");
  const [roomId, setRoomId] = useState("");
  const [chestId, setChestId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    item_type: "",
    pocket_id: "",
    chest_id: "",
    room_id: "",
    quantity: 0,
    unit: "",
    upc: "",
    notes: "",
    image_file: "",
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
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Upload a file
      const payloadFile = new FormData();
      payloadFile.append("file", selectedFile);
      console.log("Sending Payload File: ", payloadFile);
      const responseFile = await fetch(`${config.BACKEND_URL}/items/photo`, {
        method: "POST",
        body: payloadFile,
      });
      const dataFile = await responseFile.json();
      console.log(dataFile);
      setFormData({
        ...formData,
        image_file: dataFile.image_file,
        thumb_file: dataFile.thumb_file,
      });
      // Create an Item
      const payloadItem = formData;
      payloadItem.image_file = dataFile.image_file;
      console.log("Sending Payload Item: ", payloadItem);
      const responseItem = await fetch(`${config.BACKEND_URL}/items/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadItem),
      });
      const dataItem = await responseItem.json();
      console.log(dataItem);
    } catch (error) {
      console.error("Error fetching data:", error);
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
          Select an item type:
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
          Enter a unit:
          <input
            type="text"
            value={formData.unit}
            onChange={(e) =>
              setFormData({
                ...formData,
                unit: e.target.value,
              })
            }
          />
        </label>
        <ListRooms bubbleUp={bubbleUpRooms} />
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
        <label>
          Select an image:
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {selectedFile && <p>Selected file: {selectedFile.name}</p>}
        </label>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default CreateItem;
