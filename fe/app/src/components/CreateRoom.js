import React, { useState } from "react";
import { toast } from "react-toastify";

import config from "../config";

const CreateRoom = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = formData;
      console.log("Sending Payload: ", payload);
      const response = await fetch(`${config.BACKEND_URL}/rooms/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log(response.json());
      toast.success(`Create Successful for new Room`, {
        theme: "colored",
      });
      setFormData({
        ...formData,
        name: "",
        location: "",
      });
    } catch (error) {
      // Handle errors (e.g., display an error message)
      console.error("Error submitting form:", error);
      toast.error(`Error submitting form: ${error.message}`, {
        theme: "colored",
      });
    }
  };

  return (
    <>
      <h1>Create a new Room</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter a name:
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
          />
        </label>
        <label>
          Enter a Location:
          <input
            type="text"
            value={formData.location}
            onChange={(e) =>
              setFormData({
                ...formData,
                location: e.target.value,
              })
            }
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default CreateRoom;
