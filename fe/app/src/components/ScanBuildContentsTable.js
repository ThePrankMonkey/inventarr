import React, { useState } from "react";

const ItemTable = ({ items }) => {
  const [columns] = useState(Object.keys(items[0] || {}));

  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            {columns.map((column) => (
              <td key={`${item.id}-${column}`}>{item[column]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const PocketTable = ({ pockets }) => {
  const [columns] = useState(Object.keys(pockets[0] || {}));

  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {pockets.map((pocket) => (
          <tr key={pocket.id}>
            {columns.map((column) => (
              <td key={`${pocket.id}-${column}`}>{pocket[column]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ScanBuildContentsTable = ({ scanContents }) => {
  console.log("Building a table with the following values");
  console.log(scanContents);

  const { items, pockets } = scanContents;

  return (
    <>
      <h2>Contents</h2>
      <div>
        {items.length > 0 && (
          <div>
            <h2>Items</h2>
            <ItemTable items={items} />
          </div>
        )}
        {pockets.length > 0 && (
          <div>
            <h2>Pockets</h2>
            <PocketTable pockets={pockets} />
          </div>
        )}
      </div>
    </>
  );
};

export default ScanBuildContentsTable;
