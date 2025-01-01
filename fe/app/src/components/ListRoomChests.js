import React, { useState, useEffect } from "react";

import config from "../config";

const ListRoomChests = ({ roomId, bubbleUp, chestValue }) => {
  const [chests, setChests] = useState([]);
  const [selectedChest, setSelectedChest] = useState(chestValue); // Selected user from dropdown

  useEffect(() => {
    // Fetch user data from an API
    const fetchChests = async () => {
      const response = await fetch(
        `${config.BACKEND_URL}/rooms/${roomId}/chests`
      );
      console.log(response);
      const data = await response.json();
      // console.log(data);
      setChests(data);
    };
    fetchChests();
  }, [roomId]);

  useEffect(() => {
    setSelectedChest(chestValue);
  }, [chestValue]);

  const handleChestChange = (event) => {
    setSelectedChest(event.target.value);
    bubbleUp(event.target.value);
  };
  return (
    <select value={selectedChest} onChange={handleChestChange}>
      <option value="">Select Chest</option>
      {chests.map((chest) => (
        <option key={chest.id} value={chest.id}>
          {chest.id}, {chest.name}
        </option>
      ))}
    </select>
  );
};

export default ListRoomChests;
