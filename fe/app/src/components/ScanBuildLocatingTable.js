import React from "react";

const ScanBuildLocatingTable = ({ scanLocating }) => {
  console.log("Building a table with the following values");
  console.log(scanLocating);

  const { chest, pocket, room } = scanLocating;

  return (
    <>
      <h2>Locating</h2>
      <div>
        {room && (
          <p>
            <b>Room:</b> {room.name} ({room.location})
          </p>
        )}
        {chest && (
          <p>
            <b>Chest:</b> {chest.name}
          </p>
        )}
        {pocket && (
          <p>
            <b>Pocket:</b> {pocket.name} ({pocket.location})
          </p>
        )}
      </div>
    </>
  );
};

export default ScanBuildLocatingTable;
