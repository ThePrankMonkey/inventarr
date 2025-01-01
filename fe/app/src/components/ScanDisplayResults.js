import React from "react";

import ScanBuildDataTable from "./ScanBuildDataTable";
import ScanBuildLocatingTable from "./ScanBuildLocatingTable";
import ScanBuildContentsTable from "./ScanBuildContentsTable";

const ScanDisplayResults = ({ responseData }) => {
  console.log("Building a table with the following values");
  console.log(responseData);

  return (
    <>
      <h2>Data for {responseData.entry_type}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
        <div>
          <ScanBuildDataTable scanData={responseData.data} />
        </div>
        <div>
          <ScanBuildLocatingTable scanLocating={responseData.locating} />
        </div>
        <div>
          <ScanBuildContentsTable scanContents={responseData.contents} />
        </div>
      </div>
    </>
  );
};

export default ScanDisplayResults;
