import React, { useState, useEffect } from "react";

import config from "../config";
import { preventExtremeLabels } from "../helpers";

import ListChests from "./ListChests";
import ListRooms from "./ListRooms";

const ModifyChest = () => {
  const minLabel = config.MIN_LABEL_WIDTH_INCHES;
  const maxLabel = config.MAX_LABEL_WIDTH_INCHES;
  const [chestId, setChestId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    label_width: "",
    label_height: "",
    room_id: "",
  });

  useEffect(() => {
    handleChestChange();
  }, [chestId]);

  const bubbleUpChests = (value) => {
    setChestId(value);
    handleChestChange(value);
  };
  const bubbleUpRooms = (value) => {
    setRoomId(value);
    setFormData({
      ...formData,
      room_id: value,
    });
  };

  const handleChestChange = async (value) => {
    // Don't pull details until a value is actually used
    if (value === undefined) {
      console.debug("value is not set yet...");
      return;
    } else {
      console.debug("value is set:", value);
    }
    const response = await fetch(`${config.BACKEND_URL}/chests/${value}`);
    const data = await response.json();
    console.log("Room:", data.room_id);
    setRoomId(data.room_id);
    const updatedFormData = Object.keys(data).reduce(
      (acc, key) => ({
        ...acc,
        [key]: data[key],
      }),
      { ...formData }
    );

    setFormData(updatedFormData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = formData;
      // PATCH Chest
      console.log("Sending Payload: ", payload);
      const response = await fetch(`${config.BACKEND_URL}/chests/${chestId}`, {
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
      //TODO Update Banner
    } catch (error) {
      // Handle errors (e.g., display an error message)
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <h1>Modify an existing Chest</h1>
      <>
        <ListChests bubbleUp={bubbleUpChests} />
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
          Enter a label width (inches):
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
          Enter a label height (inches):
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
        <label>
          <ListRooms bubbleUp={bubbleUpRooms} roomValue={roomId} />
        </label>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default ModifyChest;
