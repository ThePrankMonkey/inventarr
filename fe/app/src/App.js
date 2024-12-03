import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css"; // Import your CSS styles
import "./mvp.css"; // Import your CSS styles
import NavBar from "./components/NavBar";
import CreateItem from "./components/CreateItem";
import Create from "./components/Create";

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/createItem" element={<CreateItem />} />
          <Route path="/create" element={<Create />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
