import React, { useState, useEffect } from "react";

const ListRooms = ({ bubbleUp }) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(""); // Selected user from dropdown

  useEffect(() => {
    // Fetch user data from an API
    const fetchRooms = async () => {
      const response = await fetch("http://127.0.0.1:5123/rooms");
      // console.log(response);
      const data = await response.json();
      // console.log(data);
      setRooms(data);
    };
    fetchRooms();
  }, []);

  const handleRoomChange = (event) => {
    setSelectedRoom(event.target.value);
    bubbleUp(event.target.value);
  };
  return (
    <select value={selectedRoom} onChange={handleRoomChange}>
      <option value="">Select Room</option>
      {rooms.map((room) => (
        <option key={room.id} value={room.id}>
          {room.id}, {room.name} in {room.location}
        </option>
      ))}
    </select>
  );
};

export default ListRooms;
