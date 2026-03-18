import React, { useEffect, useMemo, useState } from "react";
import RentModal from "../components/RentModal";
import ToolCard from "../components/ToolCard";
import { useShop } from "../context/ShopContext";

const DEFAULT_CATEGORIES = ["All", "Tractor", "Equipment", "Harvester", "Irrigation", "Tools"];
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

function LoadingCard() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-green-100 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
      <div className="h-56 animate-pulse bg-gradient-to-br from-green-100 to-green-50" />
      <div className="space-y-4 p-6">
        <div className="h-4 w-24 animate-pulse rounded-full bg-green-100" />
        <div className="h-7 w-2/3 animate-pulse rounded-full bg-slate-200" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded-full bg-slate-100" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-100" />
        </div>
        <div className="flex items-center justify-between pt-3">
          <div className="h-10 w-24 animate-pulse rounded-2xl bg-green-100" />
          <div className="h-11 w-28 animate-pulse rounded-full bg-green-200" />
        </div>
      </div>
    </div>
  );
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
    <main className="bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.18),transparent_24%),linear-gradient(180deg,#f7fff7_0%,#ffffff_20%,#ffffff_100%)] px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <section className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2rem] border border-green-100 bg-white shadow-[0_24px_70px_rgba(22,101,52,0.10)]">
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.35fr)_340px] lg:items-center lg:px-10 lg:py-10">
            <div>
              <p className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-green-700">
                Tool marketplace
              </p>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.8rem]">
                Available Farming Tools
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Discover tractors, harvesters, and essential farm equipment in a clean catalog designed for quick search, simple filters, and confident booking.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium text-slate-600">
                <div className="rounded-full border border-green-100 bg-green-50 px-4 py-2">Responsive tool grid</div>
                <div className="rounded-full border border-green-100 bg-white px-4 py-2">Search by name</div>
                <div className="rounded-full border border-green-100 bg-white px-4 py-2">Category filters</div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-green-100 bg-gradient-to-br from-green-600 to-green-700 p-6 text-white shadow-[0_20px_40px_rgba(22,101,52,0.22)]">
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-green-100">Live availability</div>
              <div className="mt-3 text-4xl font-bold">{availableCount}</div>
              <p className="mt-2 text-sm leading-6 text-green-50">
                out of {tools.length} listed tools are ready to book today.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xl font-semibold">{categories.length - 1}</div>
                  <div className="mt-1 text-green-100">categories</div>
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xl font-semibold">{visibleTools.length}</div>
                  <div className="mt-1 text-green-100">showing now</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-green-100 bg-green-50/60 px-6 py-6 sm:px-8 lg:px-10">
            <div className="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_240px] xl:grid-cols-[minmax(0,1.5fr)_240px_auto] xl:items-end">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Search tools</span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-green-700">⌕</span>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search by tool name"
                    className="w-full rounded-2xl border border-green-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-700 outline-none transition duration-200 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Category</span>
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="w-full rounded-2xl border border-green-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition duration-200 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-2xl border border-green-100 bg-white px-5 py-4 text-sm text-slate-600 xl:justify-self-end">
                <div className="font-semibold text-slate-900">{visibleTools.length} matching tools</div>
                <div className="mt-1">Use filters to quickly find the right farm equipment.</div>
              </div>
            </div>
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
            <>
              <div className="mb-5 flex items-center justify-between gap-4 px-1">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Browse ready-to-rent equipment</h2>
                  <p className="mt-1 text-sm text-slate-600">Modern farming tools presented in a clean, mobile-friendly grid.</p>
                </div>
              </div>

              <div className="mb-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
            </>
          )}

          {tools.length > 0 && (
            <div className="mt-2 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: Math.min(visibleTools.length === 0 ? 3 : 0, 3) }).map((_, index) => (
                <LoadingCard key={index} />
              ))}
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
