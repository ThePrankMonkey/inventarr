import React, { useState, useEffect } from "react";

import config from "../config";

const ListChestPockets = ({ chestId, bubbleUp, pocketValue }) => {
  const [pockets, setpockets] = useState([]);
  const [selectedPocket, setSelectedPocket] = useState(pocketValue); // Selected user from dropdown

  useEffect(() => {
    // Fetch user data from an API
    const fetchPokets = async () => {
      const response = await fetch(
        `${config.BACKEND_URL}/chests/${chestId}/pockets`
      );
      console.log(response);
      const data = await response.json();
      // console.log(data);
      setpockets(data);
    };
    fetchPokets();
  }, [chestId]);

  useEffect(() => {
    setSelectedPocket(pocketValue);
  }, [pocketValue]);

  const handlePocketChange = (event) => {
    setSelectedPocket(event.target.value);
    bubbleUp(event.target.value);
  };
  return (
    <select value={selectedPocket} onChange={handlePocketChange}>
      <option value="">Select Pocket</option>
      {pockets.map((pocket) => (
        <option key={pocket.id} value={pocket.id}>
          {pocket.id}, {pocket.name} in {pocket.location}
        </option>
      ))}
    </select>
  );
};

export default ListChestPockets;
