import React from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import tractorHero from "../assets/tractor-hero.jpg";
import ToolCard from "./ToolCard";

export default function Hero() {
  const navigate = useNavigate();
  const { tools } = useShop();
  const featuredTools = (tools || []).slice(0, 3);

  return (
    <main className="bg-gradient-to-b from-green-50 via-white to-green-50/50">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center rounded-full border border-green-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-green-700 shadow-sm">
            Smart farming rentals
          </div>
          <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Simple tool rentals for modern farms.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            Find reliable tractors, tillers, and essential farm tools in one place. Clean design, clear pricing, and a faster way to book the equipment your field needs.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/tools")}
              className="inline-flex items-center justify-center rounded-full bg-green-700 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              Rent Tools Now
            </button>
            <button
              type="button"
              onClick={() => navigate("/contact")}
              className="inline-flex items-center justify-center rounded-full border border-green-200 bg-white px-7 py-3.5 text-base font-semibold text-green-800 transition hover:border-green-300 hover:bg-green-50"
            >
              Talk to us
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              ["50+", "Farm-ready tools"],
              ["Easy", "Fast booking flow"],
              ["Local", "Trusted equipment owners"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-3xl border border-green-100 bg-white p-5 shadow-sm">
                <div className="text-2xl font-bold text-green-800">{value}</div>
                <div className="mt-1 text-sm text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] bg-green-200/50 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-green-100 bg-white p-3 shadow-[0_30px_80px_rgba(22,101,52,0.18)]">
            <img
              src={tractorHero}
              alt="Tractor working in a green farm field"
              className="h-[280px] w-full rounded-[1.5rem] object-cover sm:h-[360px] lg:h-[520px]"
            />
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-green-50 p-4">
                <div className="text-sm font-medium uppercase tracking-[0.2em] text-green-700">Quick access</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">Book equipment without the clutter.</div>
              </div>
              <div className="rounded-3xl bg-slate-900 p-4 text-white">
                <div className="text-sm font-medium uppercase tracking-[0.2em] text-green-200">Farm focused</div>
                <div className="mt-2 text-lg font-semibold">Clean cards, clear spacing, and responsive booking.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-700">Featured equipment</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Clean cards built for quick comparison.</h2>
          </div>
          <button
            type="button"
            onClick={() => navigate("/tools")}
            className="inline-flex items-center justify-center rounded-full border border-green-200 bg-white px-5 py-3 text-sm font-semibold text-green-800 transition hover:bg-green-50"
          >
            Browse all tools
          </button>
        </div>

        {featuredTools.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} onRent={() => navigate("/tools")} compact />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-green-200 bg-white p-10 text-center shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900">No tools listed yet.</h3>
            <p className="mt-3 text-slate-600">Add your first farming tool from your profile and it will appear here automatically.</p>
            <button
              type="button"
              onClick={() => navigate("/tools")}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              Rent Tools Now
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
