import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Tools from "./pages/Tools";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Reviews from "./components/Reviews";

import MyBookings from "./pages/MyBookings";
import RentRequests from "./pages/RentRequests";
import MyToolsPage from "./pages/MyToolsPage";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reviews" element={<Reviews />} />   {/* new */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/bookings" element={<MyBookings />} />
        <Route path="/profile/my-tools" element={<MyToolsPage />} />
        <Route path="/profile/requests" element={<RentRequests />} />
      </Routes>
    </>
  );
}
