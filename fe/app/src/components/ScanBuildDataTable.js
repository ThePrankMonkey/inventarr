import React from "react";

const ScanBuildDataTable = ({ scanData }) => {
  console.log("Building a table with the following values");
  console.log(scanData);

  return (
    <>
      <h2>Data</h2>
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(scanData).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ScanBuildDataTable;
