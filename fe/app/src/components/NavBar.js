import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav>
      <Link to="/view">View Inventory</Link>
      <Link to="/createItem">Create Item</Link>
      <Link to="/createChest">Create Chest</Link>
      <Link to="/createRoom">Create Room</Link>
    </nav>
  );
};

export default NavBar;
