import React, { useState, useEffect } from "react";

import config from "../config";

const ListPockets = ({ bubbleUp, value }) => {
  const [pockets, setPockets] = useState([]);
  const [selectedPocket, setSelectedPocket] = useState(""); // Selected user from dropdown

  useEffect(() => {
    const fetchPockets = async () => {
      const response = await fetch(`${config.BACKEND_URL}/pockets`);
      // console.log(response);
      const data = await response.json();
      // console.log(data);
      setPockets(data);
    };
    fetchPockets();
  }, [value]);

  const handlePocketChange = (event) => {
    setSelectedPocket(event.target.value);
    bubbleUp(event.target.value);
  };
  return (
    <label>
      Select a Pocket:
      <select value={selectedPocket} onChange={handlePocketChange}>
        <option value="">Select Pocket</option>
        {pockets.map((pocket) => (
          <option key={pocket.id} value={pocket.id}>
            {pocket.id}, {pocket.name}
          </option>
        ))}
      </select>
    </label>
  );
};

export default ListPockets;
