import React, { useState } from "react";
import ModifyItem from "./ModifyItem";
// import ModifyPocket from "./ModifyPocket";
// import ModifyChest from "./ModifyChest";
// import ModifyRoom from "./ModifyRoom";

const Modify = () => {
  const [models, setModels] = useState(["Item", "Pocket", "Chest", "Room"]);
  const [selectedModel, setSelectedModel] = useState("");

  const handleModelSelect = (event) => {
    console.log(event.target.value);
    setSelectedModel(event.target.value);
  };

  return (
    <>
      <select value={selectedModel} onChange={handleModelSelect}>
        <option value="">Select a Model to modify</option>
        {models.map((model, index) => (
          <option key={index} value={model}>
            {model}
          </option>
        ))}
      </select>
      {selectedModel == "Item" ? <ModifyItem /> : ""}
      {/* {selectedModel == "Pocket" ? <ModifyPocket /> : ""} */}
      {/* {selectedModel == "Chest" ? <ModifyChest /> : ""} */}
      {/* {selectedModel == "Room" ? <ModifyRoom /> : ""} */}
    </>
  );
};

export default Modify;
