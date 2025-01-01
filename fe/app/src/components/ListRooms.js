import React, { useState, useEffect } from "react";

import config from "../config";

const ListRooms = ({ bubbleUp, roomValue }) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(roomValue); // Selected user from dropdown

  useEffect(() => {
    // Fetch user data from an API
    const fetchRooms = async () => {
      const response = await fetch(`${config.BACKEND_URL}/rooms`);
      // console.log(response);
      const data = await response.json();
      // console.log(data);
      setRooms(data);
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    setSelectedRoom(roomValue);
  }, [roomValue]);

  const handleRoomChange = (event) => {
    setSelectedRoom(event.target.value);
    bubbleUp(event.target.value);
  };
  return (
    <label>
      Select a room:
      <select value={selectedRoom} onChange={handleRoomChange}>
        <option value="">Select Room</option>
        {rooms.map((room) => (
          <option key={room.id} value={room.id}>
            {room.id}, {room.name} in {room.location}
          </option>
        ))}
      </select>
    </label>
  );
};

export default ListRooms;
