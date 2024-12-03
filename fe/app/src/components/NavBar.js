import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav>
      <Link to="/view">View Inventory</Link>
      <Link to="/create">Create</Link>
      <Link to="/modify">Modify</Link>
    </nav>
  );
};

export default NavBar;
