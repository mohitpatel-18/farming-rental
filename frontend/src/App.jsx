// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
// use the new Home page instead of the old Hero
import Home from "./pages/Home";

import Tools from "./pages/Tools";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";

import MyBookings from "./pages/MyBookings";
import RentRequests from "./pages/RentRequests";
import MyToolsPage from "./pages/MyToolsPage";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Home (Hero replaced by Home preview + 6 tools) */}
        <Route path="/" element={<Home />} />

        {/* Main pages */}
        <Route path="/tools" element={<Tools />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />

        {/* Profile sub-pages */}
        <Route path="/profile/bookings" element={<MyBookings />} />
        <Route path="/profile/my-tools" element={<MyToolsPage />} />
        <Route path="/profile/requests" element={<RentRequests />} />
      </Routes>
    </>
  );
}
