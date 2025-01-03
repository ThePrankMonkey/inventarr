import React, { useState, useEffect } from "react";

import ItemImageBlobRenderer from "./ItemImageBlobRenderer";

const ViewItemTable = ({ data }) => {
  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

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
            <tr key={item.id}>
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

export default ViewItemTable;
