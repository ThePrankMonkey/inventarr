import React, { useState, useEffect } from "react";

import config from "../config";
import { preventExtremeLabels } from "../helpers";

import ListPockets from "./ListPockets";
import ListRooms from "./ListRooms";
import ListRoomChests from "./ListRoomChests";

const ModifyPocket = () => {
  const minLabel = config.MIN_LABEL_WIDTH_INCHES;
  const maxLabel = config.MAX_LABEL_WIDTH_INCHES;
  const [pocketId, setPocketId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [chestId, setChestId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    label_width: "",
    label_height: "",
    chest_id: "",
    room_id: "",
  });

  useEffect(() => {
    handlePocketChange();
  }, [pocketId]);

  const bubbleUpPockets = (value) => {
    setPocketId(value);
    handlePocketChange(value);
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

  const handlePocketChange = async (value) => {
    // Don't pull details until a value is actually used
    if (value === undefined) {
      console.debug("value is not set yet...");
      return;
    } else {
      console.debug("value is set:", value);
    }
    const response = await fetch(`${config.BACKEND_URL}/pockets/${value}`);
    const data = await response.json();
    console.log("Room:", data.room_id);
    setRoomId(data.room_id);
    console.log("Chest:", data.chest_id);
    setChestId(data.chest_id);
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
      // PATCH Pocket
      console.log("Sending Payload: ", payload);
      const response = await fetch(
        `${config.BACKEND_URL}/pockets/${pocketId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
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
      <h1>Modify an existing Pocket</h1>
      <>
        <ListPockets bubbleUp={bubbleUpPockets} />
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
          Enter a location:
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
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default ModifyPocket;
