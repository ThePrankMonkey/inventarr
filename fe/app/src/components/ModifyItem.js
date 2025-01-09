import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

import config from "../config";

import ListItemTypes from "./ListItemTypes";
import ListItems from "./ListItems";
import ListRooms from "./ListRooms";
import ListRoomChests from "./ListRoomChests";
import ListChestPockets from "./ListChestPockets";

const ModifyItem = () => {
  const [itemType, setItemType] = useState("");
  const [itemId, setItemId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [chestId, setChestId] = useState("");
  const [pocketId, setPocketId] = useState("");
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
    thumb_file: "",
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    handleItemChange();
  }, [itemId]);

  const bubbleUpItems = (value) => {
    setItemId(value);
    setFormData({
      ...formData,
      itemId: value,
    });
    handleItemChange(value);
  };
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
    setPocketId("");
  };
  const bubbleUpRoomChests = (value) => {
    setChestId(value);
    setFormData({
      ...formData,
      chest_id: value,
    });
  };
  const bubbleUpChestPockets = (value) => {
    setPocketId(value);
    setFormData({
      ...formData,
      pocket_id: value,
    });
  };

  const handleItemChange = async (value) => {
    // Don't pull item details until a value is actually used
    if (value === undefined) {
      console.debug("value is not set yet...");
      return;
    } else {
      console.debug("value is set:", value);
    }
    const response = await fetch(`${config.BACKEND_URL}/items/${value}`);
    const data = await response.json();
    setItemType(data.item_type);
    console.log("Room:", data.room_id);
    setRoomId(data.room_id);
    console.log("Chest:", data.chest_id);
    setChestId(data.chest_id);
    console.log("Pocket:", data.pocket_id);
    setPocketId(data.pocket_id);
    const updatedFormData = Object.keys(data).reduce(
      (acc, key) => ({
        ...acc,
        [key]: data[key],
      }),
      { ...formData }
    );

    setFormData(updatedFormData);

    //Reset uploaded image
    setSelectedFile(null);
    fileInputRef.current.value = ""; // Clear the input value
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = formData;
      // Upload a file
      if (selectedFile != null) {
        const payloadFile = new FormData();
        payloadFile.append("file", selectedFile);
        console.log("Sending Payload File: ", payloadFile);
        const responseFile = await fetch(`${config.BACKEND_URL}/items/photo`, {
          method: "POST",
          body: payloadFile,
        });
        const dataFile = await responseFile.json();
        console.log("Image Upload response:", dataFile);
        setFormData({
          ...formData,
          image_file: dataFile.image_file,
          thumb_file: dataFile.thumb_file,
        });
        payload.image_file = dataFile.image_file;
        payload.thumb_file = dataFile.thumb_file;
      }
      // Remove images if blank
      if (payload.image_file === "") {
        delete payload.image_file;
        delete payload.thumb_file;
      }
      // PATCH Item
      console.log("Sending Payload: ", payload);
      const response = await fetch(`${config.BACKEND_URL}/items/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log(response.json());
      // Handle notification
      toast.success(`Modify Successful for Item ${itemId}`, {
        theme: "colored",
      });
    } catch (error) {
      // Handle errors (e.g., display an error message)
      console.error("Error submitting form:", error);
      toast.error(`Error submitting form: ${error.message}`, {
        theme: "colored",
      });
    }
  };

  return (
    <>
      <h1>Modify an existing Item</h1>
      <>
        <ListItems bubbleUp={bubbleUpItems} />
      </>
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
          <ListItemTypes
            bubbleUp={bubbleUpItemTypes}
            itemTypeValue={itemType}
          />
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
        <ListRooms bubbleUp={bubbleUpRooms} roomValue={roomId} />
        <label>
          Select a chest:
          {roomId ? (
            <ListRoomChests
              bubbleUp={bubbleUpRoomChests}
              roomId={roomId}
              chestValue={chestId}
            />
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
              pocketValue={pocketId}
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
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          {selectedFile && <p>Selected file: {selectedFile.name}</p>}
        </label>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default ModifyItem;
