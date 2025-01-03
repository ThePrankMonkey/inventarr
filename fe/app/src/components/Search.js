import React, { useState } from "react";

import ViewItemTable from "./ViewItemTable";
import config from "../config";

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const query = searchText;
      const response = await fetch(
        `${config.BACKEND_URL}/items/search/full/${query}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
      setSearchResults(data);
      //TODO Update Banner
    } catch (error) {
      // Handle errors (e.g., display an error message)
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <h2>Search for an Item</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Enter text to search:
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </label>
        <button type="submit">Search</button>
      </form>
      <hr />
      {searchResults.length > 0 ? <ViewItemTable data={searchResults} /> : ""}
    </>
  );
};

export default Search;
