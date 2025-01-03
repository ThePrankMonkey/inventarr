import React, { useState, useEffect } from "react";

import ItemImageBlobRenderer from "./ItemImageBlobRenderer";
import ViewItemTable from "./ViewItemTable";
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
      <ViewItemTable data={tableData} />
    </>
  );
};

export default View;
