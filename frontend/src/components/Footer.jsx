import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-green-100 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-700">Farming Rental</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">A simple rental experience for hardworking farms.</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
            Clear pricing, practical equipment cards, and a responsive layout that works smoothly on desktop and mobile.
          </p>
        </div>

        <div className="grid gap-3 text-sm text-slate-500 sm:grid-cols-2 md:justify-self-end">
          <div>
            <div className="font-semibold text-slate-900">Explore</div>
            <div className="mt-3 space-y-2">
              <div>Home</div>
              <div>Tools</div>
              <div>Contact</div>
            </div>
          </div>
          <div>
            <div className="font-semibold text-slate-900">Support</div>
            <div className="mt-3 space-y-2">
              <div>Reviews</div>
              <div>Bookings</div>
              <div>Rental help</div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-green-100 px-4 py-4 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Farming Rental. Built with a clean green-and-white farm theme.
      </div>
    </footer>
  );
}
