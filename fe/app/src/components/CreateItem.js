import React, { useState, useEffect } from "react";

import ListRooms from "./ListRooms";
import ListRoomChests from "./ListRoomChests";
import ListChestPockets from "./ListChestPockets";

const CreateItem = () => {
  const [roomId, setRoomId] = useState("");
  const [chestId, setChestId] = useState("");
  const [formData, setFormData] = useState({
    chest: "",
  });

  const bubbleUpRooms = (value) => {
    setRoomId(value);
  };
  const bubbleUpRoomChests = (value) => {
    setChestId(value);
  };
  const bubbleUpChestPockets = (value) => {
    setFormData({
      ...formData,
      pocket_id: value,
    });
  };

  return (
    <>
      <ListRooms bubbleUp={bubbleUpRooms} />
      {roomId ? (
        <ListRoomChests bubbleUp={bubbleUpRoomChests} roomId={roomId} />
      ) : (
        "Please select a room first"
      )}
      {chestId ? (
        <ListChestPockets bubbleUp={bubbleUpChestPockets} chestId={chestId} />
      ) : (
        "Please select a chest first"
      )}
    </>
  );
};

export default CreateItem;
