import React, { useState, useEffect } from "react";

const ListChestPockets = ({ chestId, bubbleUp }) => {
  const [pockets, setpockets] = useState([]);
  const [selectedPocket, setSelectedPocket] = useState(""); // Selected user from dropdown

  useEffect(() => {
    // Fetch user data from an API
    const fetchPokets = async () => {
      const response = await fetch(
        `http://127.0.0.1:5123/chests/${chestId}/pockets`
      );
      console.log(response);
      const data = await response.json();
      // console.log(data);
      setpockets(data);
    };
    fetchPokets();
  }, [chestId]);

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
