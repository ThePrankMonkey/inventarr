import React, { useState } from "react";
import { toast } from "react-toastify";

import ListRooms from "./ListRooms";
import ListRoomChests from "./ListRoomChests";
import config from "../config";
import { preventExtremeLabels } from "../helpers";

const CreatePocket = () => {
  const minLabel = config.MIN_LABEL_WIDTH_INCHES;
  const maxLabel = config.MAX_LABEL_WIDTH_INCHES;
  const [roomId, setRoomId] = useState("");
  const [chestId, setChestId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    chest_id: "",
    room_id: "",
    label_width: 0,
    label_height: 0,
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
      // Handle notification
      toast.success(`Create Successful for new Pocket`, {
        theme: "colored",
      });
      // Clear relevant fields
      setFormData({
        ...formData,
        name: "",
        location: "",
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
          Enter a Label Width (in inches):
          <input
            type="number"
            step="any"
            min={minLabel}
            max={maxLabel}
            value={formData.label_width}
            onChange={(e) => {
              preventExtremeLabels(e);
              setFormData({
                ...formData,
                label_width: e.target.value,
              });
            }}
          />
        </label>
        <label>
          Enter a Label Height (in inches):
          <input
            type="number"
            step="any"
            min={minLabel}
            max={maxLabel}
            value={formData.label_height}
            onChange={(e) => {
              preventExtremeLabels(e);
              setFormData({
                ...formData,
                label_height: e.target.value,
              });
            }}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default CreatePocket;
