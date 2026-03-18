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
    <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-green-100 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_28px_60px_rgba(22,101,52,0.18)]">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className={`w-full object-cover transition duration-500 group-hover:scale-105 ${compact ? "h-48" : "h-56"}`}
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <div className="rounded-full bg-white/92 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-green-700 shadow-sm">
            {category}
          </div>
          <div
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] shadow-sm ${isAvailable ? "bg-green-600 text-white" : "bg-slate-900/90 text-white"}`}
          >
            {isAvailable ? "Available" : "Rented"}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">Owned by {owner}</p>
          </div>
          <div className="shrink-0 rounded-2xl border border-green-100 bg-green-50 px-3 py-2 text-right">
            <div className="text-lg font-bold text-green-800">₹{price || "—"}</div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-green-700">per day</div>
          </div>
        </div>

        <p className="mt-4 min-h-[72px] text-sm leading-6 text-slate-600">{description}</p>

        <div className="mt-5 rounded-2xl border border-green-100 bg-gradient-to-r from-white to-green-50 px-4 py-3 text-sm text-slate-600">
          <div className="font-medium text-slate-900">{isAvailable ? "Ready for booking" : "Currently rented"}</div>
          <div className="mt-1">{isAvailable ? "Ideal for fast scheduling and daily field work." : "This tool will be available once the current rental ends."}</div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <div className={`text-sm ${isAvailable ? "text-slate-500" : "font-medium text-amber-700"}`}>
            {isAvailable ? "Clean equipment • Easy booking" : "Booking disabled for now"}
          </div>
          <button
            type="button"
            onClick={() => onRent?.(tool)}
            disabled={!isAvailable}
            className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-300 ${isAvailable ? "bg-green-700 hover:scale-[1.02] hover:bg-green-800" : "cursor-not-allowed bg-slate-300"}`}
          >
            {isAvailable ? "Book Now" : "Unavailable"}
          </button>
        </div>
      </div>
    </article>
  );
}
