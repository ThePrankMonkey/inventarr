import React, { useState, useEffect } from "react";
import CreateItem from "./CreateItem";
import CreatePocket from "./CreatePocket";
import CreateChest from "./CreateChest";
import CreateRoom from "./CreateRoom";

const Create = () => {
  const [models, setModels] = useState(["Item", "Pocket", "Chest", "Room"]);
  const [selectedModel, setSelectedModel] = useState("");

  const handleModelSelect = (event) => {
    console.log(event.target.value);
    setSelectedModel(event.target.value);
  };

  return (
    <>
      <label>
        Select a Model to create
        <select value={selectedModel} onChange={handleModelSelect}>
          <option value="">Select a Model</option>
          {models.map((model, index) => (
            <option key={index} value={model}>
              {model}
            </option>
          ))}
        </select>
      </label>
      {selectedModel == "Item" ? <CreateItem /> : ""}
      {selectedModel == "Pocket" ? <CreatePocket /> : ""}
      {selectedModel == "Chest" ? <CreateChest /> : ""}
      {selectedModel == "Room" ? <CreateRoom /> : ""}
    </>
  );
};

export default Create;
