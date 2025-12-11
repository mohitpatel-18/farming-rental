// src/components/Header.jsx
import React, { useState } from "react";
import SignupModal from "./SignupModal";
import { useUser } from "../context/UserContext";

export default function Header() {
  const { user, logout } = useUser(); // <- this will work only if UserProvider wraps App
  const [openSign, setOpenSign] = useState(false);

  return (
    <header className="py-4 border-b">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/src/assets/logo.png" alt="logo" className="w-12 h-12" />
          <div>
            <div className="font-serif text-xl">Farming Rental</div>
            <div className="text-sm text-gray-600">Rent the right farming equipment</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <button className="rounded-full bg-gray-100 w-10 h-10 flex items-center justify-center">{user.name?.[0]?.toUpperCase()}</button>
              <button onClick={logout} className="px-3 py-1 border rounded">Logout</button>
            </>
          ) : (
            <button onClick={()=>setOpenSign(true)} className="px-3 py-1 border rounded">Sign up</button>
          )}
        </div>
      </div>

      <SignupModal open={openSign} onClose={() => setOpenSign(false)} />
    </header>
  );
}
