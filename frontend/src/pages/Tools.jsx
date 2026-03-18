import React, { useEffect, useMemo, useState } from "react";
import RentModal from "../components/RentModal";
import ToolCard from "../components/ToolCard";
import { useShop } from "../context/ShopContext";

const DEFAULT_CATEGORIES = ["All", "Tractor", "Equipment", "Harvester", "Irrigation"];
const ACTIVE_BOOKING_STATUSES = new Set(["approved", "pending"]);

function getToolName(tool) {
  return tool?.title || tool?.name || "";
}

function getToolCategory(tool) {
  return tool?.category?.trim() || "Equipment";
}

function getBookedToolIds() {
  try {
    const bookings = JSON.parse(localStorage.getItem("farming_bookings") || "[]");
    return new Set(
      bookings
        .filter((booking) => ACTIVE_BOOKING_STATUSES.has(booking?.status || "pending"))
        .map((booking) => booking?.toolId)
        .filter(Boolean)
    );
  } catch {
    return new Set();
  }
}

export default function Tools() {
  const { tools } = useShop();
  const [rentTool, setRentTool] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bookedToolIds, setBookedToolIds] = useState(() => getBookedToolIds());

  useEffect(() => {
    const syncBookedTools = () => setBookedToolIds(getBookedToolIds());

    syncBookedTools();
    window.addEventListener("storage", syncBookedTools);

    return () => window.removeEventListener("storage", syncBookedTools);
  }, []);

  const categories = useMemo(() => {
    const dynamicCategories = tools
      .map((tool) => getToolCategory(tool))
      .filter(Boolean)
      .map((category) => category.trim())
      .filter((category, index, list) => list.indexOf(category) === index)
      .sort((a, b) => a.localeCompare(b));

    return Array.from(new Set([...DEFAULT_CATEGORIES, ...dynamicCategories]));
  }, [tools]);

  const visibleTools = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return tools.filter((tool) => {
      const matchesSearch = !normalizedQuery || getToolName(tool).toLowerCase().includes(normalizedQuery);
      const matchesCategory = selectedCategory === "All" || getToolCategory(tool) === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, tools]);

  const availableCount = tools.filter((tool) => !bookedToolIds.has(tool?.id)).length;

  return (
    <main className="bg-gradient-to-b from-white via-green-50/40 to-white px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-green-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-700">Equipment catalog</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Browse farm tools with a cleaner, faster layout.
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Search by tool name, filter by category, check availability instantly, and rent with a simple day-based total.
              </p>
            </div>
            <div className="rounded-3xl bg-green-50 px-5 py-4 text-sm text-green-900">
              <div className="font-semibold">
                {availableCount} of {tools.length} tools available
              </div>
              <div className="mt-1 text-green-700">Live filters keep the catalog quick to scan.</div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 rounded-[1.5rem] border border-green-100 bg-green-50/60 p-4 md:grid-cols-[minmax(0,2fr)_220px] md:items-end">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Search tools</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by tool name"
                className="mt-2 w-full rounded-2xl border border-green-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Category</span>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-green-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-8">
          {tools.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-green-200 bg-white p-12 text-center shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">No tools yet.</h2>
              <p className="mt-3 text-slate-600">Add equipment from your profile to start renting it out.</p>
            </div>
          ) : visibleTools.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-green-200 bg-white p-12 text-center shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">No tools match your filters.</h2>
              <p className="mt-3 text-slate-600">Try another tool name or switch to a different category.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {visibleTools.map((tool) => {
                const availability = bookedToolIds.has(tool?.id) ? "rented" : "available";

                return (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    availability={availability}
                    onRent={availability === "available" ? setRentTool : undefined}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      <RentModal
        open={!!rentTool}
        onClose={() => setRentTool(null)}
        onBooked={() => setBookedToolIds(getBookedToolIds())}
        tool={rentTool}
      />
    </main>
  );
}
