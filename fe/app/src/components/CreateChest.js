import React, { useState, useEffect } from "react";

import ListRooms from "./ListRooms";
import config from "../config";
import { preventExtremeLabels } from "../helpers";

const CreateChest = () => {
  const minLabel = config.MIN_LABEL_WIDTH_INCHES;
  const maxLabel = config.MAX_LABEL_WIDTH_INCHES;
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    room_id: "",
    label_width: 0,
    label_height: 0,
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
        <ListRooms bubbleUp={bubbleUpRooms} />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default CreateChest;
