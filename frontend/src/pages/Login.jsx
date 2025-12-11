// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

export default function Login(){
  const { authenticate, loginUser } = useShop();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  function onSubmit(e){
    e.preventDefault();
    const res = authenticate(email.trim(), pass);
    if (!res.ok) { setMsg(res.message); return; }
    loginUser(res.user);
    setMsg("");
    nav("/");
  }

  return (
    <main className="max-w-md mx-auto mt-16 p-6 bg-white border rounded">
      <h1 className="text-2xl font-semibold mb-4">User Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border p-3 rounded" />
        <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" type="password" className="w-full border p-3 rounded" />
        <button className="w-full px-4 py-2 bg-farmGreen text-white rounded">Sign In</button>
        {msg && <div className="text-sm text-red-600 mt-2">{msg}</div>}
      </form>
    </main>
  );
}
