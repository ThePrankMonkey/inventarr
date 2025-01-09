import React, { useState, useRef } from "react";
import { toast } from "react-toastify";

import ScanDisplayResults from "./ScanDisplayResults";
import config from "../config";

const Scan = () => {
  const [scanString, setScanString] = useState("");
  const [responseData, setResponseData] = useState({});
  const scanStringRef = useRef(null);

  const handleInputChange = (event) => {
    setScanString(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const payload = { scan: scanString };
      console.log("Sending Payload File: ", payload);
      const response = await fetch(`${config.BACKEND_URL}/inventory/v2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
      setResponseData(data);
      // Highlight the whole input to allow full overwrite on next scan
      handleFocus();
    } catch (error) {
      // Handle errors (e.g., display an error message)
      console.error("Error submitting form:", error);
      toast.error(`Error submitting form: ${error.message}`, {
        theme: "colored",
      });
    }
  };

  const handleFocus = () => {
    scanStringRef.current.select(); // Select all text on focus
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Trigger your function here
      handleSubmit();
    }
  };

  return (
    <>
      <label>
        Paste label scan results here:
        <input
          type="text"
          value={scanString}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyUp={handleKeyPress}
          ref={scanStringRef}
        />
      </label>
      <hr />
      {Object.keys(responseData).length > 0 ? (
        <ScanDisplayResults responseData={responseData} />
      ) : (
        "Please scan in a new label"
      )}
    </>
  );
};

export default Scan;
