import React, { useState, useEffect } from "react";

import config from "../config";

const ListItems = ({ bubbleUp }) => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(""); // Selected user from dropdown

  useEffect(() => {
    // Fetch user data from an API
    const fetchItems = async () => {
      const response = await fetch(`${config.BACKEND_URL}/items`);
      // console.log(response);
      const data = await response.json();
      // console.log(data);
      setItems(data);
    };
    fetchItems();
  }, []);

  const handleItemChange = (event) => {
    setSelectedItem(event.target.value);
    bubbleUp(event.target.value);
  };
  return (
    <select value={selectedItem} onChange={handleItemChange}>
      <option value="">Select Item</option>
      {items.map((item) => (
        <option key={item.id} value={item.id}>
          {item.id}, {item.name}
        </option>
      ))}
    </select>
  );
};

export default ListItems;
