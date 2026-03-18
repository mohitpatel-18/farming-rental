import React from "react";
import defaultEquipment from "../assets/default-equipment.jpg";

function getToolRate(tool) {
  return Number(tool?.pricePerDay ?? tool?.pricePerHour ?? tool?.hourly ?? tool?.price ?? 0);
}

export default function ToolCard({ tool, onRent, compact = false, availability = "available" }) {
  const image = tool?.image || tool?.imageUrl || tool?.photo || defaultEquipment;
  const title = tool?.title || tool?.name || "Farm equipment";
  const description = tool?.description || "Reliable equipment for planting, tilling, harvesting, and day-to-day farm work.";
  const owner = tool?.ownerName || tool?.ownerEmail || "Trusted local owner";
  const price = getToolRate(tool);
  const category = tool?.category || "Equipment";
  const isAvailable = availability === "available";

  return (
    <article className="group h-full overflow-hidden rounded-3xl border border-green-100 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(22,101,52,0.18)]">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className={`w-full object-cover transition duration-500 group-hover:scale-105 ${compact ? "h-48" : "h-56"}`}
        />
        <div
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] shadow-sm ${isAvailable ? "bg-white/90 text-green-700" : "bg-slate-900/90 text-white"}`}
        >
          {isAvailable ? "Available" : "Rented"}
        </div>
      </div>

      <div className="flex h-full flex-col p-5 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              {category}
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">By {owner}</p>
          </div>
          <div className="rounded-2xl bg-green-50 px-3 py-2 text-right">
            <div className="text-lg font-bold text-green-800">₹{price || "—"}</div>
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-green-700">per day</div>
          </div>
        </div>

        <p className="min-h-[72px] text-sm leading-6 text-slate-600">{description}</p>

        <div className="mt-6 flex items-center justify-between gap-3">
          <div className={`text-sm ${isAvailable ? "text-slate-500" : "font-medium text-amber-700"}`}>
            {isAvailable ? "Fast booking • Clean equipment" : "Currently out on rent"}
          </div>
          <button
            type="button"
            onClick={() => onRent?.(tool)}
            disabled={!isAvailable}
            className={`inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-green-300 ${isAvailable ? "bg-green-700 hover:bg-green-800" : "cursor-not-allowed bg-slate-300"}`}
          >
            {isAvailable ? "Rent Tools Now" : "Unavailable"}
          </button>
        </div>
      </div>
    </article>
  );
}
