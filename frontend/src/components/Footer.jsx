import React from "react";
export default function Footer(){
  return (
    <footer className="mt-12 bg-gray-50 border-t">
      <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-gray-600">
        <div>© {new Date().getFullYear()} Farming Rental</div>
        <div className="mt-2">Terms · Privacy · Contact</div>
      </div>
    </footer>
  );
}
