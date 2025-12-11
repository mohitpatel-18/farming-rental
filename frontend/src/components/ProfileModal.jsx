// src/components/ProfileModal.jsx
import React, { useEffect, useState } from "react";
import { useShop } from "../context/ShopContext";

export default function ProfileModal({ open, onClose }) {
  const { user, updateUser, addProduct } = useShop();
  const [editing, setEditing] = useState(false);

  // profile form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");

  // add tool form state (hourly rate + file upload)
  const [tName, setTName] = useState("");
  const [tCategory, setTCategory] = useState("");
  const [tHourly, setTHourly] = useState("");
  const [tImageFile, setTImageFile] = useState(null);
  const [tImagePreview, setTImagePreview] = useState("");

  const [msg, setMsg] = useState("");
  const [toolMsg, setToolMsg] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setGender(user.gender || "");
    }
  }, [user, open]);

  // when user selects file, make dataURL preview
  useEffect(() => {
    if (!tImageFile) return setTImagePreview("");
    const reader = new FileReader();
    reader.onload = () => {
      setTImagePreview(reader.result);
    };
    reader.readAsDataURL(tImageFile);
  }, [tImageFile]);

  if (!open) return null;

  function saveProfile(e) {
    e.preventDefault();
    if (!name.trim()) { setMsg("Name required"); return; }
    const updated = { name: name.trim(), email: user.email, phone: phone.trim(), address: address.trim(), gender };
    updateUser(updated);
    setMsg("Profile updated");
    setEditing(false);
    setTimeout(() => setMsg(""), 1400);
  }

  async function addTool(e) {
    e.preventDefault();
    if (!tName.trim()) { setToolMsg("Tool name required"); return; }

    // if user uploaded a file we already have dataURL in tImagePreview
    const imageToSave = tImagePreview || "/src/assets/default-equipment.jpg";
    const created = addProduct({ name: tName.trim(), category: tCategory.trim() || "General", hourlyRate: tHourly || 0, image: imageToSave });
    setToolMsg("Tool added: " + created.name);
    setTName(""); setTCategory(""); setTHourly(""); setTImageFile(null); setTImagePreview("");
    setTimeout(() => setToolMsg(""), 1600);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex">
          {/* Left: Profile details */}
          <div className="w-1/2 p-8 bg-white">
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-xl font-semibold text-gray-700">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold">{user?.name}</h3>
                <div className="text-sm text-gray-500">{user?.email}</div>
                <div className="text-sm text-gray-600 mt-2">Role: <span className="font-medium">{user?.role}</span></div>

                <div className="mt-4 space-y-2">
                  <div><strong>Phone:</strong> {user?.phone || "-"}</div>
                  <div><strong>Address:</strong> {user?.address || "-"}</div>
                  <div><strong>Gender:</strong> {user?.gender || "-"}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              {!editing ? (
                <div className="flex items-center gap-3">
                  <button onClick={() => setEditing(true)} className="px-4 py-2 bg-green-700 text-white rounded">Edit</button>
                  {/* removed the old Close next to Edit as requested */}
                </div>
              ) : (
                <form onSubmit={saveProfile} className="space-y-3">
                  <input value={name} onChange={e=>setName(e.target.value)} className="w-full border p-2 rounded" placeholder="Full name" />
                  <input value={phone} onChange={e=>setPhone(e.target.value)} className="w-full border p-2 rounded" placeholder="Phone number" />
                  <input value={address} onChange={e=>setAddress(e.target.value)} className="w-full border p-2 rounded" placeholder="Address" />
                  <select value={gender} onChange={e=>setGender(e.target.value)} className="w-full border p-2 rounded">
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>

                  <div className="flex items-center gap-3">
                    <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded">Update</button>
                    <button type="button" onClick={() => { setEditing(false); setMsg(""); }} className="px-4 py-2 border rounded">Cancel</button>
                  </div>
                  {msg && <div className="text-sm text-green-700">{msg}</div>}
                </form>
              )}
            </div>
          </div>

          {/* Right: Add Tools (with file upload & hourly rate) */}
          <div className="w-1/2 p-8 bg-white">
            <h4 className="text-lg font-semibold mb-3">Add Tools / Equipment</h4>
            <p className="text-sm text-gray-500 mb-4">Add a tool listing — it will appear in the collection (demo).</p>

            <form onSubmit={addTool} className="space-y-3">
              <input value={tName} onChange={e=>setTName(e.target.value)} placeholder="Tool name" className="w-full border p-2 rounded" />
              <input value={tCategory} onChange={e=>setTCategory(e.target.value)} placeholder="Category" className="w-full border p-2 rounded" />

              {/* hourly rate */}
              <input value={tHourly} onChange={e=>setTHourly(e.target.value)} placeholder="Hourly rate (₹)" type="number" className="w-full border p-2 rounded" />

              {/* file upload */}
              <div>
                <label className="text-sm block mb-1">Image (upload)</label>
                <input type="file" accept="image/*" onChange={(e)=>setTImageFile(e.target.files && e.target.files[0])} />
                {tImagePreview && (
                  <img src={tImagePreview} alt="preview" className="mt-2 w-32 h-24 object-cover rounded border" />
                )}
              </div>

              <div className="flex items-center gap-3">
                <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded">Add Tool</button>
                <button type="button" onClick={() => { setTName(""); setTCategory(""); setTHourly(""); setTImageFile(null); setTImagePreview(""); }} className="px-4 py-2 border rounded">Reset</button>
              </div>

              {toolMsg && <div className="text-sm text-green-700">{toolMsg}</div>}
            </form>

            <div className="mt-6 border-t pt-4 text-sm text-gray-600">
              <div className="font-semibold mb-2">Quick actions</div>
              <div className="space-y-2">
                <button className="px-3 py-2 bg-gray-50 rounded w-full text-left">View my listings</button>
                <button className="px-3 py-2 bg-gray-50 rounded w-full text-left">Manage bookings</button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t text-right">
          <button onClick={onClose} className="px-4 py-2 border rounded">Close</button>
        </div>
      </div>
    </div>
  );
}
