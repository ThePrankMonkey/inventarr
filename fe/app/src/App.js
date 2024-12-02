import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css"; // Import your CSS styles
import "./mvp.css"; // Import your CSS styles
import NavBar from "./components/NavBar";
import CreateItem from "./components/CreateItem";

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/createItem" element={<CreateItem />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
