import React from "react";
export default function NewsLetterBox(){
  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <div className="bg-white border p-6 rounded-md">
        <h4 className="font-semibold">Get updates</h4>
        <p className="text-gray-600 text-sm">Signup for deals & new tools</p>
        <div className="mt-4 flex gap-2">
          <input className="border p-2 rounded-md flex-1" placeholder="Your email" />
          <button className="px-4 py-2 bg-farmGreen text-white rounded-md">Subscribe</button>
        </div>
      </div>
    </div>
  );
}
