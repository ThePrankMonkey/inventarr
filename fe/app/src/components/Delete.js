import React, { useState } from "react";
import DeleteItem from "./DeleteItem";
import DeletePocket from "./DeletePocket";
import DeleteChest from "./DeleteChest";
import DeleteRoom from "./DeleteRoom";

const Modify = () => {
  const [models, setModels] = useState(["Item", "Pocket", "Chest", "Room"]);
  const [selectedModel, setSelectedModel] = useState("");

  const handleModelSelect = (event) => {
    console.log(`Selected to delete from model ${event.target.value}`);
    setSelectedModel(event.target.value);
  };

  return (
    <>
      <h2>Delete</h2>
      <select value={selectedModel} onChange={handleModelSelect}>
        <option value="">Select a Model to delete</option>
        {models.map((model, index) => (
          <option key={index} value={model}>
            {model}
          </option>
        ))}
      </select>
      {selectedModel === "Item" ? <DeleteItem /> : ""}
      {selectedModel === "Pocket" ? <DeletePocket /> : ""}
      {selectedModel === "Chest" ? <DeleteChest /> : ""}
      {selectedModel === "Room" ? <DeleteRoom /> : ""}
    </>
  );
};

export default Modify;
