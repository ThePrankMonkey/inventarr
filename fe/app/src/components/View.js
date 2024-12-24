import React, { useState, useEffect } from "react";

import ItemImageBlobRenderer from "./ItemImageBlobRenderer";
import config from "../config";

const View = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    // Fetch user data from an API
    const fetchItems = async () => {
      const url = `${config.BACKEND_URL}/items/full`;
      console.log(url);
      const response = await fetch(`${config.BACKEND_URL}/items/full`);
      // console.log(response);
      const data = await response.json();
      // console.log(data);
      setTableData(data);
    };
    fetchItems();
  }, []);

  return (
    <>
      <h1>View Inventory</h1>
      <table>
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Id</th>
            <th>Name</th>
            <th>ItemType</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Room</th>
            <th>Chest</th>
            <th>Pocket</th>
            <th>UPC</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, i) => (
            <tr key={i}>
              <td>
                <ItemImageBlobRenderer item={item} />
              </td>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.item_type}</td>
              <td>{item.quantity}</td>
              <td>{item.unit}</td>
              <td>{item.room.name}</td>
              <td>{item.chest.name}</td>
              <td>{item.pocket.name}</td>
              <td>{item.upc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default View;
