import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css"; // Import your CSS styles
import "./mvp.css"; // Import your CSS styles
import NavBar from "./components/NavBar";
import View from "./components/View";
import Scan from "./components/Scan";
import Search from "./components/Search";
import Create from "./components/Create";
import Modify from "./components/Modify";
import Delete from "./components/Delete";

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<View />} />
          <Route path="/view" element={<View />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/search" element={<Search />} />
          <Route path="/create" element={<Create />} />
          <Route path="/modify" element={<Modify />} />
          <Route path="/delete" element={<Delete />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
