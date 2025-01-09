import React, { useState } from "react";
import { toast } from "react-toastify";

import ListChests from "./ListChests";
import config from "../config";

const DeleteChest = () => {
  const [selectedId, setSelectedId] = useState("");

  const bubbleUp = (value) => {
    setSelectedId(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${config.BACKEND_URL}/chests/${selectedId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
      // Handle notification
      toast.success(`Delete Successful for Chest ${selectedId}`, {
        theme: "colored",
      });
      // Clear relevant fields
      setSelectedId("");
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
      <h3>Delete an existing Chest</h3>
      <ListChests bubbleUp={bubbleUp} value={selectedId} />
      <form onSubmit={handleSubmit}>
        <button type="submit">Delete</button>
      </form>
    </>
  );
};

export default DeleteChest;
