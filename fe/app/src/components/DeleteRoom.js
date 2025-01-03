import React, { useState } from "react";

import ListRooms from "./ListRooms";
import config from "../config";

const DeleteRoom = () => {
  const [selectedId, setSelectedId] = useState("");

  const bubbleUp = (value) => {
    setSelectedId(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${config.BACKEND_URL}/rooms/${selectedId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
      setSelectedId("");
      //TODO: Update Banner
    } catch (error) {
      // Handle errors (e.g., display an error message)
      //TODO: Update Banner
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <h3>Delete an existing Room</h3>
      <ListRooms bubbleUp={bubbleUp} roomValue={selectedId} />
      <form onSubmit={handleSubmit}>
        <button type="submit">Delete</button>
      </form>
    </>
  );
};

export default DeleteRoom;
