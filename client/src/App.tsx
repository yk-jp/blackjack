import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// bootstrap
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap/dist/js/bootstrap.js";
// pages
import Login from "./pages/Login/Login";
import Main from "./pages/Main/Main";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Main" element={<Main />} />
        </Routes>
      </Router>
  );
}

export default App;
