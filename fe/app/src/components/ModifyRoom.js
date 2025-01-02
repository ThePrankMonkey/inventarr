import React, { useState, useEffect } from "react";

import config from "../config";

import ListRooms from "./ListRooms";

const ModifyRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });

  useEffect(() => {
    handleRoomChange();
  }, [roomId]);

  const bubbleUpRooms = (value) => {
    setRoomId(value);
    handleRoomChange(value);
  };

  const handleRoomChange = async (value) => {
    // Don't pull details until a value is actually used
    if (value === undefined) {
      console.debug("value is not set yet...");
      return;
    } else {
      console.debug("value is set:", value);
    }
    const response = await fetch(`${config.BACKEND_URL}/rooms/${value}`);
    const data = await response.json();
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
      // PATCH Room
      console.log("Sending Payload: ", payload);
      const response = await fetch(`${config.BACKEND_URL}/rooms/${roomId}`, {
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
      <h1>Modify an existing Room</h1>
      <>
        <ListRooms bubbleUp={bubbleUpRooms} />
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
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default ModifyRoom;
