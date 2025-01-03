import React, { useState, useEffect } from "react";

import config from "../config";

const ListChests = ({ bubbleUp, value }) => {
  const [chests, setChests] = useState([]);
  const [selectedChest, setSelectedChest] = useState(""); // Selected user from dropdown

  useEffect(() => {
    const fetchChests = async () => {
      const response = await fetch(`${config.BACKEND_URL}/chests`);
      // console.log(response);
      const data = await response.json();
      // console.log(data);
      setChests(data);
    };
    fetchChests();
  }, [value]);

  const handleChestChange = (event) => {
    setSelectedChest(event.target.value);
    bubbleUp(event.target.value);
  };
  return (
    <label>
      Select a Chest:
      <select value={selectedChest} onChange={handleChestChange}>
        <option value="">Select Chest</option>
        {chests.map((chest) => (
          <option key={chest.id} value={chest.id}>
            {chest.id}, {chest.name}
          </option>
        ))}
      </select>
    </label>
  );
};

export default ListChests;
