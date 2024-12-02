import React, { useState, useEffect } from "react";

const ListRoomChests = ({ roomId, bubbleUp }) => {
  const [chests, setChests] = useState([]);
  const [selectedChest, setSelectedChest] = useState(""); // Selected user from dropdown

  useEffect(() => {
    // Fetch user data from an API
    const fetchChests = async () => {
      const response = await fetch(
        `http://127.0.0.1:5123/rooms/${roomId}/chests`
      );
      console.log(response);
      const data = await response.json();
      // console.log(data);
      setChests(data);
    };
    fetchChests();
  }, [roomId]);

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
