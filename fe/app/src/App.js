import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css"; // Import your CSS styles
import "./mvp.css"; // Import your CSS styles
import NavBar from "./components/NavBar";
import View from "./components/View";
import Create from "./components/Create";
import Modify from "./components/Modify";

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/view" element={<View />} />
          <Route path="/create" element={<Create />} />
          <Route path="/modify" element={<Modify />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
