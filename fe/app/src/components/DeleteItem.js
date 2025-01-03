import React, { useState } from "react";

import ListItems from "./ListItems";
import config from "../config";

const DeleteItem = () => {
  const [selectedId, setSelectedId] = useState("");

  const bubbleUp = (value) => {
    setSelectedId(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${config.BACKEND_URL}/items/${selectedId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
      //TODO: Update Banner
      setSelectedId("");
    } catch (error) {
      // Handle errors (e.g., display an error message)
      //TODO: Update Banner
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <h3>Delete an existing Item</h3>
      <ListItems bubbleUp={bubbleUp} value={selectedId} />
      <form onSubmit={handleSubmit}>
        <button type="submit">Delete</button>
      </form>
    </>
  );
};

export default DeleteItem;
