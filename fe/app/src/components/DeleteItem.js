import React, { useState } from "react";
import { toast } from "react-toastify";

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
      // Handle notification
      toast.success(`Delete Successful for Item ${selectedId}`, {
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
      <h3>Delete an existing Item</h3>
      <ListItems bubbleUp={bubbleUp} value={selectedId} />
      <form onSubmit={handleSubmit}>
        <button type="submit">Delete</button>
      </form>
    </>
  );
};

export default DeleteItem;
