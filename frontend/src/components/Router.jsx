// src/components/Router.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Register from "./Register";
import Login from "./Login";
import ProfilePage from "./ProfilePage";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/user-profile" element={<ProfilePage />} />
        <Route path="/user/:username" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
