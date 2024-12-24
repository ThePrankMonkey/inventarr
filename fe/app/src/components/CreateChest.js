import React, { useState, useEffect } from "react";

import ListRooms from "./ListRooms";
import ListRoomChests from "./ListRoomChests";
import config from "../config";

const CreateChest = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    room_id: "",
  });

  const bubbleUpRooms = (value) => {
    setFormData({
      ...formData,
      room_id: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = formData;
      console.log("Sending Payload: ", payload);
      const response = await fetch(`${config.BACKEND_URL}/chests/`, {
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
      <h1>Create a new Chest</h1>
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
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default CreateChest;
