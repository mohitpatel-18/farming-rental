import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu() {
  const { user, logout } = useUser();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  if (!user) return null;

  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white shadow rounded p-3 z-20">
          <div className="font-semibold">{user.name}</div>
          <div className="text-xs text-gray-600">{user.email}</div>
          <div className="text-xs text-gray-600">Role: {user.role}</div>
          <hr className="my-2"/>
          <button onClick={() => { nav("/profile"); setOpen(false); }} className="block w-full text-left px-2 py-1 hover:bg-gray-50">Profile</button>
          <button onClick={() => { logout(); setOpen(false); }} className="block w-full text-left px-2 py-1 text-red-600 hover:bg-gray-50">Logout</button>
        </div>
      )}
    </div>
  );
}
