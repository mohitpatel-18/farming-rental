import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";
import { TOOL_CATEGORIES } from "../utils/toolUtils";

const EMPTY_PROFILE = { name: "", gender: "", phone: "", email: "", address: "" };
const EMPTY_TOOL_FORM = { title: "", description: "", pricePerDay: "", category: TOOL_CATEGORIES[0], image: "" };

const profileTabs = [
  { id: "profile", label: "Profile" },
  { id: "add", label: "Add Tools" },
  { id: "mytools", label: "My Tools" },
];

function Field({ label, required = false, children, hint, error }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <span>{label}</span>
        {required && <span className="text-green-700">*</span>}
      </div>
      {children}
      {hint && !error && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
      {error && <p className="mt-2 text-xs font-medium text-rose-600">{error}</p>}
    </label>
  );
}

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const { tools, addTool, removeTool } = useShop();
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(EMPTY_PROFILE);
  const [toolForm, setToolForm] = useState(EMPTY_TOOL_FORM);
  const [previewDays, setPreviewDays] = useState(1);
  const [previewImage, setPreviewImage] = useState("");
  const [toolErrors, setToolErrors] = useState({});
  const [submitState, setSubmitState] = useState("idle");
  const messageTimeoutRef = useRef(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        gender: user.gender || "",
        phone: user.phone || "",
        email: user.email || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const myTools = useMemo(
    () => tools.filter((tool) => tool.ownerEmail === user?.email),
    [tools, user?.email]
  );

  const showMessage = (nextMessage) => {
    setMessage(nextMessage);
    window.clearTimeout(messageTimeoutRef.current);
    messageTimeoutRef.current = window.setTimeout(() => setMessage(""), 2500);
  };

  useEffect(() => () => window.clearTimeout(messageTimeoutRef.current), []);

  const handleProfileSubmit = (event) => {
    event.preventDefault();

    try {
      updateProfile(form);
      setEditing(false);
      showMessage("Profile updated.");
    } catch (error) {
      showMessage(error.message || "Failed to update profile.");
    }
  };

  const resetToolForm = () => {
    setToolForm(EMPTY_TOOL_FORM);
    setPreviewImage("");
    setPreviewDays(1);
    setToolErrors({});
    setSubmitState("idle");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const image = reader.result?.toString() || "";
      setToolForm((currentForm) => ({ ...currentForm, image }));
      setPreviewImage(image);
    };
    reader.readAsDataURL(file);
  };

  const validateToolForm = () => {
    const nextErrors = {};

    if (!toolForm.title.trim()) {
      nextErrors.title = "Tool name is required.";
    }

    if (!toolForm.pricePerDay || Number(toolForm.pricePerDay) <= 0) {
      nextErrors.pricePerDay = "Enter a valid daily rental price.";
    }

    if (!toolForm.category) {
      nextErrors.category = "Select a category.";
    }

    if (!toolForm.description.trim()) {
      nextErrors.description = "Add a short description for renters.";
    }

    return nextErrors;
  };

  const handleAddTool = (event) => {
    event.preventDefault();

    if (!user) {
      showMessage("Login to add tools.");
      return;
    }

    const nextErrors = validateToolForm();
    setToolErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitState("error");
      showMessage("Please complete the required tool details.");
      return;
    }

    addTool(
      {
        title: toolForm.title,
        description: toolForm.description,
        category: toolForm.category,
        image: toolForm.image,
        pricePerDay: toolForm.pricePerDay,
      },
      user
    );

    resetToolForm();
    setSubmitState("success");
    setActiveTab("add");
    showMessage("Tool added.");
  };

  if (!user) {
    return <div className="px-6 py-10 text-center text-slate-700">Please login to view profile.</div>;
  }

  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] border border-green-100 bg-white shadow-[0_24px_70px_rgba(22,101,52,0.10)]">
          <div className="border-b border-green-100 bg-gradient-to-r from-white via-green-50 to-white px-6 py-8 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="inline-flex rounded-full bg-green-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-green-700">
                  Account workspace
                </p>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Manage your profile and farming tools</h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                  Keep your account details updated, add tools with a polished listing form, and manage the equipment you share with local renters.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-green-100 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
                <div className="font-semibold text-slate-900">{myTools.length} tools listed</div>
                <div className="mt-1">Simple green-and-white controls across every profile section.</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {profileTabs.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 ${active ? "bg-green-700 text-white shadow-[0_10px_25px_rgba(22,101,52,0.22)]" : "border border-green-100 bg-white text-slate-700 hover:border-green-300 hover:text-green-700"}`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-6 py-8 sm:px-8 lg:px-10">
            {activeTab === "profile" && (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
                <div className="rounded-[1.75rem] border border-green-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-900">Profile</h2>
                      <p className="mt-2 text-sm text-slate-600">Keep your contact details accurate for seamless rental communication.</p>
                    </div>
                  </div>

                  {!editing ? (
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {Object.entries(form).map(([field, value]) => (
                        <div key={field} className="rounded-2xl border border-green-100 bg-green-50/60 p-4">
                          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{field}</div>
                          <div className="mt-2 text-base font-medium text-slate-900">{value || "-"}</div>
                        </div>
                      ))}

                      <div className="sm:col-span-2 mt-2 flex flex-wrap gap-3">
                        <button type="button" className="rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800" onClick={() => setEditing(true)}>
                          Edit Profile
                        </button>
                        <button type="button" className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50" onClick={logout}>
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleProfileSubmit} className="mt-6 grid gap-5 sm:grid-cols-2">
                      <Field label="Name" required>
                        <input className="field-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
                      </Field>

                      <Field label="Gender">
                        <select className="field-input" value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value })}>
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </Field>

                      <Field label="Phone">
                        <input className="field-input" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
                      </Field>

                      <Field label="Email" required>
                        <input className="field-input" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
                      </Field>

                      <div className="sm:col-span-2">
                        <Field label="Address">
                          <textarea className="field-input field-input--textarea" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
                        </Field>
                      </div>

                      <div className="sm:col-span-2 flex flex-wrap gap-3">
                        <button type="submit" className="rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800">
                          Update Profile
                        </button>
                        <button type="button" className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50" onClick={() => setEditing(false)}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                <div className="rounded-[1.75rem] border border-green-100 bg-gradient-to-br from-green-600 to-green-700 p-6 text-white shadow-[0_20px_45px_rgba(22,101,52,0.22)]">
                  <div className="text-sm font-semibold uppercase tracking-[0.24em] text-green-100">Quick overview</div>
                  <div className="mt-4 text-3xl font-bold">{myTools.length}</div>
                  <p className="mt-2 text-sm leading-6 text-green-50">tools are currently connected to your account and ready for management.</p>
                </div>
              </div>
            )}

            {activeTab === "add" && (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_320px]">
                <div className="rounded-[1.75rem] border border-green-100 bg-white p-6 shadow-sm sm:p-8">
                  <div className="flex flex-col gap-3 border-b border-green-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-green-700">Add Tool Form Card</p>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Create a clean tool listing</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600">Add your farming tool details with clear fields, validation hints, and a simple image upload area.</p>
                    </div>
                    <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-900">
                      Required fields help keep the listing complete.
                    </div>
                  </div>

                  {submitState === "success" && (
                    <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
                      Success! Your tool has been added to the rental listing.
                    </div>
                  )}

                  <form onSubmit={handleAddTool} className="mt-6 grid gap-5 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <Field label="Upload Image" hint="UI-only upload is supported with local preview.">
                        <div className="relative overflow-hidden rounded-[1.5rem] border-2 border-dashed border-green-200 bg-gradient-to-br from-green-50 to-white p-5">
                          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[1.25rem] border border-green-100 bg-white/70 text-center">
                            {previewImage ? (
                              <img src={previewImage} alt="Tool preview" className="h-[220px] w-full object-cover" />
                            ) : (
                              <div className="px-6 py-10">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">↑</div>
                                <h3 className="text-lg font-semibold text-slate-900">Upload tool image</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-500">Click to choose a photo. If your backend is not ready yet, this UI still shows a clean local preview.</p>
                              </div>
                            )}
                          </div>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 cursor-pointer opacity-0" />
                        </div>
                      </Field>
                    </div>

                    <Field label="Tool Name" required error={toolErrors.title}>
                      <input
                        className={`field-input ${toolErrors.title ? "border-rose-300 bg-rose-50/40" : ""}`}
                        placeholder="e.g. John Deere Tractor"
                        value={toolForm.title}
                        onChange={(event) => {
                          setToolForm({ ...toolForm, title: event.target.value });
                          setToolErrors((current) => ({ ...current, title: "" }));
                        }}
                        required
                      />
                    </Field>

                    <Field label="Price per day" required error={toolErrors.pricePerDay}>
                      <input
                        className={`field-input ${toolErrors.pricePerDay ? "border-rose-300 bg-rose-50/40" : ""}`}
                        placeholder="e.g. 2500"
                        type="number"
                        min="1"
                        value={toolForm.pricePerDay}
                        onChange={(event) => {
                          setToolForm({ ...toolForm, pricePerDay: event.target.value });
                          setToolErrors((current) => ({ ...current, pricePerDay: "" }));
                        }}
                        required
                      />
                    </Field>

                    <Field label="Category" required error={toolErrors.category}>
                      <select
                        className={`field-input ${toolErrors.category ? "border-rose-300 bg-rose-50/40" : ""}`}
                        value={toolForm.category}
                        onChange={(event) => {
                          setToolForm({ ...toolForm, category: event.target.value });
                          setToolErrors((current) => ({ ...current, category: "" }));
                        }}
                        required
                      >
                        {TOOL_CATEGORIES.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Rental preview" hint="Optional preview total for quick pricing feedback.">
                      <select className="field-input" value={previewDays} onChange={(event) => setPreviewDays(Number(event.target.value))}>
                        {Array.from({ length: 12 }, (_, index) => index + 1).map((dayCount) => (
                          <option key={dayCount} value={dayCount}>{dayCount} day{dayCount > 1 ? "s" : ""}</option>
                        ))}
                      </select>
                    </Field>

                    <div className="md:col-span-2">
                      <Field label="Description" required error={toolErrors.description}>
                        <textarea
                          className={`field-input field-input--textarea ${toolErrors.description ? "border-rose-300 bg-rose-50/40" : ""}`}
                          placeholder="Write a short description about the tool, condition, and ideal use."
                          value={toolForm.description}
                          onChange={(event) => {
                            setToolForm({ ...toolForm, description: event.target.value });
                            setToolErrors((current) => ({ ...current, description: "" }));
                          }}
                          required
                        />
                      </Field>
                    </div>

                    <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-green-100 bg-green-50/70 px-5 py-4">
                      <div>
                        <div className="text-sm text-slate-500">Estimated total</div>
                        <div className="mt-1 text-2xl font-bold text-green-800">₹{Number(toolForm.pricePerDay || 0) * previewDays}</div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button type="submit" className="rounded-full bg-green-700 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-green-800">
                          Add Tool
                        </button>
                        <button type="button" className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:border-slate-300 hover:bg-white" onClick={resetToolForm}>
                          Reset
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="space-y-6">
                  <div className="rounded-[1.75rem] border border-green-100 bg-gradient-to-br from-green-600 to-green-700 p-6 text-white shadow-[0_20px_45px_rgba(22,101,52,0.22)]">
                    <div className="text-sm font-semibold uppercase tracking-[0.24em] text-green-100">Listing tips</div>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-green-50">
                      <li>• Use a clear tool name for better search visibility.</li>
                      <li>• Add price and category so renters can compare options quickly.</li>
                      <li>• Write a short description focused on real farm usage.</li>
                    </ul>
                  </div>

                  <div className="rounded-[1.75rem] border border-green-100 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900">Form checklist</h3>
                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                      <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3">Name</div>
                      <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3">Price</div>
                      <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3">Category</div>
                      <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3">Description</div>
                      <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3">Upload Image</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "mytools" && (
              <div>
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">My Tools</h2>
                    <p className="mt-2 text-sm text-slate-600">Manage the farming tools you have already listed for rent.</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {myTools.length === 0 ? (
                    <div className="rounded-[1.75rem] border border-dashed border-green-200 bg-green-50/50 p-10 text-center text-slate-600">
                      You have not added any tools yet.
                    </div>
                  ) : (
                    myTools.map((tool) => (
                      <div key={tool.id} className="flex flex-col gap-4 rounded-[1.75rem] border border-green-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5">
                        {tool.image ? (
                          <img src={tool.image} alt={tool.title} className="h-28 w-full rounded-2xl object-cover sm:w-40" />
                        ) : (
                          <div className="flex h-28 w-full items-center justify-center rounded-2xl bg-green-50 text-sm font-medium text-green-700 sm:w-40">
                            No image
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-semibold text-slate-900">{tool.title}</h3>
                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
                              {tool.category}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p>
                        </div>

                        <div className="flex flex-col gap-3 sm:items-end">
                          <div className="text-lg font-bold text-green-800">₹{tool.pricePerDay}/day</div>
                          <button className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50" onClick={() => removeTool(tool.id)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {message && (
              <div className={`mt-6 rounded-2xl px-4 py-3 text-sm font-medium ${submitState === "error" ? "border border-rose-200 bg-rose-50 text-rose-700" : "border border-green-200 bg-green-50 text-green-800"}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
