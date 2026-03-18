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

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "priceHigh", label: "Price: high to low" },
  { value: "priceLow", label: "Price: low to high" },
  { value: "name", label: "Name: A to Z" },
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

function StatCard({ label, value, caption, tone = "default" }) {
  const toneClasses =
    tone === "accent"
      ? "border-green-200 bg-gradient-to-br from-green-600 to-green-700 text-white shadow-[0_20px_45px_rgba(22,101,52,0.22)]"
      : "border-green-100 bg-white text-slate-900 shadow-sm";

  return (
    <div className={`rounded-[1.5rem] border p-5 ${toneClasses}`}>
      <div className={`text-xs font-semibold uppercase tracking-[0.24em] ${tone === "accent" ? "text-green-100" : "text-slate-500"}`}>
        {label}
      </div>
      <div className="mt-3 text-3xl font-bold">{value}</div>
      {caption && <p className={`mt-2 text-sm leading-6 ${tone === "accent" ? "text-green-50" : "text-slate-600"}`}>{caption}</p>}
    </div>
  );
}

function ChecklistItem({ label, complete }) {
  return (
    <div className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm ${complete ? "border-green-200 bg-green-50 text-green-800" : "border-slate-200 bg-white text-slate-500"}`}>
      <span>{label}</span>
      <span className="font-semibold">{complete ? "Done" : "Pending"}</span>
    </div>
  );
}

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const { tools, addTool, updateTool, removeTool } = useShop();
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState("success");
  const [form, setForm] = useState(EMPTY_PROFILE);
  const [toolForm, setToolForm] = useState(EMPTY_TOOL_FORM);
  const [previewDays, setPreviewDays] = useState(1);
  const [previewImage, setPreviewImage] = useState("");
  const [toolErrors, setToolErrors] = useState({});
  const [submitState, setSubmitState] = useState("idle");
  const [toolSearch, setToolSearch] = useState("");
  const [toolCategoryFilter, setToolCategoryFilter] = useState("All");
  const [toolSort, setToolSort] = useState("newest");
  const [editingToolId, setEditingToolId] = useState(null);
  const [editingToolForm, setEditingToolForm] = useState(EMPTY_TOOL_FORM);
  const [editingToolErrors, setEditingToolErrors] = useState({});
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

  const categoryOptions = useMemo(() => ["All", ...TOOL_CATEGORIES], []);

  const profileCompletion = useMemo(() => {
    const fields = [form.name, form.gender, form.phone, form.email, form.address];
    const completed = fields.filter((value) => value?.toString().trim()).length;
    return Math.round((completed / fields.length) * 100);
  }, [form]);

  const totalDailyValue = useMemo(
    () => myTools.reduce((sum, tool) => sum + Number(tool.pricePerDay || 0), 0),
    [myTools]
  );

  const strongestCategory = useMemo(() => {
    if (!myTools.length) {
      return "No tools yet";
    }

    const counts = myTools.reduce((accumulator, tool) => {
      accumulator[tool.category] = (accumulator[tool.category] || 0) + 1;
      return accumulator;
    }, {});

    return Object.entries(counts).sort((left, right) => right[1] - left[1])[0][0];
  }, [myTools]);

  const visibleTools = useMemo(() => {
    const searchTerm = toolSearch.trim().toLowerCase();

    return [...myTools]
      .filter((tool) => {
        const matchesSearch =
          !searchTerm ||
          tool.title.toLowerCase().includes(searchTerm) ||
          tool.description.toLowerCase().includes(searchTerm) ||
          tool.category.toLowerCase().includes(searchTerm);
        const matchesCategory = toolCategoryFilter === "All" || tool.category === toolCategoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort((left, right) => {
        switch (toolSort) {
          case "oldest":
            return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
          case "priceHigh":
            return Number(right.pricePerDay) - Number(left.pricePerDay);
          case "priceLow":
            return Number(left.pricePerDay) - Number(right.pricePerDay);
          case "name":
            return left.title.localeCompare(right.title);
          case "newest":
          default:
            return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
        }
      });
  }, [myTools, toolCategoryFilter, toolSearch, toolSort]);

  const addFormChecklist = useMemo(
    () => ({
      title: toolForm.title.trim().length >= 3,
      pricePerDay: Number(toolForm.pricePerDay) > 0,
      category: Boolean(toolForm.category),
      description: toolForm.description.trim().length >= 20,
      image: Boolean(toolForm.image),
    }),
    [toolForm]
  );

  const showMessage = (nextMessage, tone = "success") => {
    setMessage(nextMessage);
    setMessageTone(tone);
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
      showMessage(error.message || "Failed to update profile.", "error");
    }
  };

  const resetToolForm = () => {
    setToolForm(EMPTY_TOOL_FORM);
    setPreviewImage("");
    setPreviewDays(1);
    setToolErrors({});
    setSubmitState("idle");
  };

  const handleImageUpload = (event, mode = "create") => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const image = reader.result?.toString() || "";

      if (mode === "edit") {
        setEditingToolForm((currentForm) => ({ ...currentForm, image }));
        return;
      }

      setToolForm((currentForm) => ({ ...currentForm, image }));
      setPreviewImage(image);
    };
    reader.readAsDataURL(file);
  };

  const validateToolForm = (candidate) => {
    const nextErrors = {};

    if (!candidate.title.trim()) {
      nextErrors.title = "Tool name is required.";
    }

    if (!candidate.pricePerDay || Number(candidate.pricePerDay) <= 0) {
      nextErrors.pricePerDay = "Enter a valid daily rental price.";
    }

    if (!candidate.category) {
      nextErrors.category = "Select a category.";
    }

    if (!candidate.description.trim()) {
      nextErrors.description = "Add a short description for renters.";
    } else if (candidate.description.trim().length < 20) {
      nextErrors.description = "Description should be at least 20 characters.";
    }

    return nextErrors;
  };

  const handleAddTool = (event) => {
    event.preventDefault();

    if (!user) {
      showMessage("Login to add tools.", "error");
      return;
    }

    const nextErrors = validateToolForm(toolForm);
    setToolErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitState("error");
      showMessage("Please complete the required tool details.", "error");
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
    setActiveTab("mytools");
    showMessage("Tool added.");
  };

  const startToolEdit = (tool) => {
    setEditingToolId(tool.id);
    setEditingToolForm({
      title: tool.title,
      description: tool.description,
      category: tool.category,
      image: tool.image || "",
      pricePerDay: String(tool.pricePerDay || ""),
    });
    setEditingToolErrors({});
  };

  const cancelToolEdit = () => {
    setEditingToolId(null);
    setEditingToolForm(EMPTY_TOOL_FORM);
    setEditingToolErrors({});
  };

  const handleToolUpdate = (event) => {
    event.preventDefault();

    const nextErrors = validateToolForm(editingToolForm);
    setEditingToolErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      showMessage("Please fix the highlighted tool fields.", "error");
      return;
    }

    updateTool(editingToolId, {
      title: editingToolForm.title,
      description: editingToolForm.description,
      category: editingToolForm.category,
      image: editingToolForm.image,
      pricePerDay: editingToolForm.pricePerDay,
    });

    cancelToolEdit();
    showMessage("Tool updated.");
  };

  const handleToolRemove = (toolId) => {
    removeTool(toolId);
    if (editingToolId === toolId) {
      cancelToolEdit();
    }
    showMessage("Tool removed.");
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
                  Keep your account details updated, create stronger listings with live previews, and manage the equipment you share with local renters.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-green-100 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
                <div className="font-semibold text-slate-900">{myTools.length} tools listed</div>
                <div className="mt-1">Profile completeness: {profileCompletion}% with smart controls across every section.</div>
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
            <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Profile completion" value={`${profileCompletion}%`} caption="Complete every field so renters can reach you quickly." />
              <StatCard label="Tools listed" value={myTools.length} caption="Every listing remains synced to your dashboard." />
              <StatCard label="Portfolio value" value={`₹${totalDailyValue}`} caption="Combined per-day rental value of all active tools." />
              <StatCard label="Top category" value={strongestCategory} caption="Your most represented category at a glance." tone="accent" />
            </div>

            {activeTab === "profile" && (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
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

                      <Field label="Phone" hint="Add a contact number renters can call when arranging pickup.">
                        <input className="field-input" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
                      </Field>

                      <Field label="Email" required>
                        <input className="field-input" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
                      </Field>

                      <div className="sm:col-span-2">
                        <Field label="Address" hint="A full address helps renters estimate delivery or pickup logistics.">
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

                <div className="space-y-6">
                  <div className="rounded-[1.75rem] border border-green-100 bg-gradient-to-br from-green-600 to-green-700 p-6 text-white shadow-[0_20px_45px_rgba(22,101,52,0.22)]">
                    <div className="text-sm font-semibold uppercase tracking-[0.24em] text-green-100">Quick overview</div>
                    <div className="mt-4 text-3xl font-bold">{myTools.length}</div>
                    <p className="mt-2 text-sm leading-6 text-green-50">tools are currently connected to your account and ready for management.</p>
                  </div>

                  <div className="rounded-[1.75rem] border border-green-100 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900">Profile checklist</h3>
                    <div className="mt-4 space-y-3">
                      <ChecklistItem label="Name added" complete={Boolean(form.name.trim())} />
                      <ChecklistItem label="Email added" complete={Boolean(form.email.trim())} />
                      <ChecklistItem label="Phone added" complete={Boolean(form.phone.trim())} />
                      <ChecklistItem label="Address added" complete={Boolean(form.address.trim())} />
                      <ChecklistItem label="At least one tool listed" complete={myTools.length > 0} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "add" && (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_340px]">
                <div className="rounded-[1.75rem] border border-green-100 bg-white p-6 shadow-sm sm:p-8">
                  <div className="flex flex-col gap-3 border-b border-green-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-green-700">Enhanced listing studio</p>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Create a high-converting tool listing</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600">Use the guided form, checklist, and live preview to publish a cleaner and more informative listing.</p>
                    </div>
                    <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-900">
                      {Object.values(addFormChecklist).filter(Boolean).length}/5 checklist items complete
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
                                <p className="mt-2 text-sm leading-6 text-slate-500">Click to choose a photo. Even before backend uploads are ready, the local preview keeps the listing workflow polished.</p>
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
                      <Field label="Description" required error={toolErrors.description} hint="Aim for at least 20 characters and mention condition, usage, or included attachments.">
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

                    <div className="md:col-span-2 grid gap-4 rounded-[1.5rem] border border-green-100 bg-green-50/70 px-5 py-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <div className="text-sm text-slate-500">Estimated total</div>
                          <div className="mt-1 text-2xl font-bold text-green-800">₹{Number(toolForm.pricePerDay || 0) * previewDays}</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-500">Description length</div>
                          <div className="mt-1 text-xl font-semibold text-slate-900">{toolForm.description.trim().length} chars</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-500">Ready to publish</div>
                          <div className="mt-1 text-xl font-semibold text-slate-900">
                            {Object.values(addFormChecklist).every(Boolean) ? "Yes" : "Almost"}
                          </div>
                        </div>
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
                    <div className="text-sm font-semibold uppercase tracking-[0.24em] text-green-100">Live preview</div>
                    <div className="mt-4 overflow-hidden rounded-[1.5rem] bg-white text-slate-900">
                      {previewImage ? (
                        <img src={previewImage} alt="Listing preview" className="h-48 w-full object-cover" />
                      ) : (
                        <div className="flex h-48 items-center justify-center bg-green-50 text-sm font-medium text-green-700">Image preview will appear here</div>
                      )}
                      <div className="p-5">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold">{toolForm.title || "Your tool title"}</h3>
                          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
                            {toolForm.category || "Category"}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {toolForm.description.trim() || "Your listing description will appear here as you type."}
                        </p>
                        <div className="mt-4 text-xl font-bold text-green-800">₹{Number(toolForm.pricePerDay || 0) || 0}/day</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-green-100 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900">Form checklist</h3>
                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                      <ChecklistItem label="Name" complete={addFormChecklist.title} />
                      <ChecklistItem label="Price" complete={addFormChecklist.pricePerDay} />
                      <ChecklistItem label="Category" complete={addFormChecklist.category} />
                      <ChecklistItem label="Description" complete={addFormChecklist.description} />
                      <ChecklistItem label="Upload Image" complete={addFormChecklist.image} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "mytools" && (
              <div>
                <div className="mb-6 flex flex-col gap-4 rounded-[1.75rem] border border-green-100 bg-green-50/60 p-5 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">My Tools</h2>
                    <p className="mt-2 text-sm text-slate-600">Search, filter, sort, edit, and remove the farming tools you have already listed for rent.</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[620px]">
                    <input
                      className="field-input"
                      placeholder="Search tools"
                      value={toolSearch}
                      onChange={(event) => setToolSearch(event.target.value)}
                    />
                    <select className="field-input" value={toolCategoryFilter} onChange={(event) => setToolCategoryFilter(event.target.value)}>
                      {categoryOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <select className="field-input" value={toolSort} onChange={(event) => setToolSort(event.target.value)}>
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-6 grid gap-4 md:grid-cols-3">
                  <StatCard label="Visible results" value={visibleTools.length} caption="Listings that match your current filters." />
                  <StatCard label="Average price" value={`₹${myTools.length ? Math.round(totalDailyValue / myTools.length) : 0}`} caption="Average daily price across your listed tools." />
                  <StatCard label="Search status" value={toolSearch ? "Filtered" : "All tools"} caption="Use filters to focus on a specific listing segment." />
                </div>

                <div className="grid gap-4">
                  {myTools.length === 0 ? (
                    <div className="rounded-[1.75rem] border border-dashed border-green-200 bg-green-50/50 p-10 text-center text-slate-600">
                      You have not added any tools yet.
                    </div>
                  ) : visibleTools.length === 0 ? (
                    <div className="rounded-[1.75rem] border border-dashed border-green-200 bg-white p-10 text-center text-slate-600">
                      No tools match your current search and filter settings.
                    </div>
                  ) : (
                    visibleTools.map((tool) => {
                      const isEditingTool = editingToolId === tool.id;

                      return (
                        <div key={tool.id} className="rounded-[1.75rem] border border-green-100 bg-white p-4 shadow-sm sm:p-5">
                          {isEditingTool ? (
                            <form className="grid gap-5 lg:grid-cols-[180px_minmax(0,1fr)]" onSubmit={handleToolUpdate}>
                              <div className="space-y-3">
                                {editingToolForm.image ? (
                                  <img src={editingToolForm.image} alt={editingToolForm.title} className="h-44 w-full rounded-2xl object-cover" />
                                ) : (
                                  <div className="flex h-44 w-full items-center justify-center rounded-2xl bg-green-50 text-sm font-medium text-green-700">No image</div>
                                )}
                                <label className="block">
                                  <span className="mb-2 block text-sm font-semibold text-slate-700">Replace image</span>
                                  <input type="file" accept="image/*" onChange={(event) => handleImageUpload(event, "edit")} className="block w-full text-sm text-slate-600" />
                                </label>
                              </div>

                              <div className="grid gap-4 md:grid-cols-2">
                                <Field label="Tool Name" required error={editingToolErrors.title}>
                                  <input
                                    className={`field-input ${editingToolErrors.title ? "border-rose-300 bg-rose-50/40" : ""}`}
                                    value={editingToolForm.title}
                                    onChange={(event) => {
                                      setEditingToolForm({ ...editingToolForm, title: event.target.value });
                                      setEditingToolErrors((current) => ({ ...current, title: "" }));
                                    }}
                                  />
                                </Field>

                                <Field label="Price per day" required error={editingToolErrors.pricePerDay}>
                                  <input
                                    className={`field-input ${editingToolErrors.pricePerDay ? "border-rose-300 bg-rose-50/40" : ""}`}
                                    type="number"
                                    min="1"
                                    value={editingToolForm.pricePerDay}
                                    onChange={(event) => {
                                      setEditingToolForm({ ...editingToolForm, pricePerDay: event.target.value });
                                      setEditingToolErrors((current) => ({ ...current, pricePerDay: "" }));
                                    }}
                                  />
                                </Field>

                                <Field label="Category" required error={editingToolErrors.category}>
                                  <select
                                    className={`field-input ${editingToolErrors.category ? "border-rose-300 bg-rose-50/40" : ""}`}
                                    value={editingToolForm.category}
                                    onChange={(event) => {
                                      setEditingToolForm({ ...editingToolForm, category: event.target.value });
                                      setEditingToolErrors((current) => ({ ...current, category: "" }));
                                    }}
                                  >
                                    {TOOL_CATEGORIES.map((category) => (
                                      <option key={category} value={category}>{category}</option>
                                    ))}
                                  </select>
                                </Field>

                                <div className="rounded-2xl border border-green-100 bg-green-50/70 px-4 py-3">
                                  <div className="text-sm text-slate-500">Updated daily price</div>
                                  <div className="mt-1 text-2xl font-bold text-green-800">₹{Number(editingToolForm.pricePerDay || 0)}</div>
                                </div>

                                <div className="md:col-span-2">
                                  <Field label="Description" required error={editingToolErrors.description}>
                                    <textarea
                                      className={`field-input field-input--textarea ${editingToolErrors.description ? "border-rose-300 bg-rose-50/40" : ""}`}
                                      value={editingToolForm.description}
                                      onChange={(event) => {
                                        setEditingToolForm({ ...editingToolForm, description: event.target.value });
                                        setEditingToolErrors((current) => ({ ...current, description: "" }));
                                      }}
                                    />
                                  </Field>
                                </div>

                                <div className="md:col-span-2 flex flex-wrap gap-3">
                                  <button type="submit" className="rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800">
                                    Save Changes
                                  </button>
                                  <button type="button" className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50" onClick={cancelToolEdit}>
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </form>
                          ) : (
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
                                <div className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                                  Added {new Date(tool.createdAt).toLocaleDateString()}
                                </div>
                              </div>

                              <div className="flex flex-col gap-3 sm:items-end">
                                <div className="text-lg font-bold text-green-800">₹{tool.pricePerDay}/day</div>
                                <div className="flex flex-wrap gap-3">
                                  <button className="rounded-full border border-green-200 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50" onClick={() => startToolEdit(tool)} type="button">
                                    Edit
                                  </button>
                                  <button className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50" onClick={() => handleToolRemove(tool.id)} type="button">
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {message && (
              <div className={`mt-6 rounded-2xl px-4 py-3 text-sm font-medium ${messageTone === "error" ? "border border-rose-200 bg-rose-50 text-rose-700" : "border border-green-200 bg-green-50 text-green-800"}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
