import React, { useState, useEffect } from "react";

import config from "../config";

const ListItemTypes = ({ bubbleUp }) => {
  const [itemTypes, setItemTypes] = useState([]);
  const [selectedItemType, setSelectedItemType] = useState(""); // Selected user from dropdown

  useEffect(() => {
    // Fetch user data from an API
    const fetchItemTypes = async () => {
      const response = await fetch(`${config.BACKEND_URL}/items/types`);
      // console.log(response);
      const data = await response.json();
      console.log(data);
      setItemTypes(data);
    };
    fetchItemTypes();
  }, []);

  const handleItemChange = (event) => {
    setSelectedItemType(event.target.value);
    bubbleUp(event.target.value);
  };
  return (
    <select value={selectedItemType} onChange={handleItemChange}>
      <option value="">Select ItemType</option>
      {itemTypes.map((itemType, index) => (
        <option key={index} value={itemType}>
          {itemType}
        </option>
      ))}
    </select>
  );
};

export default ListItemTypes;
