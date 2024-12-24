import React, { useState, useEffect } from "react";

import ListRooms from "./ListRooms";
import ListRoomChests from "./ListRoomChests";
import config from "../config";

const CreatePocket = () => {
  const [roomId, setRoomId] = useState("");
  const [chestId, setChestId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    chest_id: "",
    room_id: "",
  });

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
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = formData;
      console.log("Sending Payload: ", payload);
      const response = await fetch(`${config.BACKEND_URL}/pockets/`, {
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
      <h1>Create a new Pocket</h1>
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
          Enter a Location:
          <input
            type="text"
            value={formData.location}
            onChange={(e) =>
              setFormData({
                ...formData,
                location: e.target.value,
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
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default CreatePocket;
