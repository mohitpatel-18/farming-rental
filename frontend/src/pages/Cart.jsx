// src/pages/Cart.jsx
import React from "react";
import { useShop } from "../context/ShopContext";

export default function Cart() {
  const { cart, updateCartHours, removeFromCart, emptyCart } = useShop();

  const subtotal = cart.reduce((s, it) => s + Number(it.lineTotal || 0), 0);

  if (!cart || cart.length === 0) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-serif mb-6">Booking Cart</h1>
        <div className="text-gray-600">Your cart is empty</div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-serif mb-6">Booking Cart</h1>

      <div className="bg-white rounded shadow p-6">
        <div className="space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 items-center border-b pb-4">
              <div className="col-span-2">
                <img src={item.imageUrl} alt={item.title} className="w-28 h-20 object-cover rounded" />
              </div>

              <div className="col-span-6">
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm text-gray-600">₹{item.hourlyRate} / hr</div>
                <div className="mt-2">
                  <label className="mr-2">Hours</label>
                  <select
                    value={item.hours}
                    onChange={(e) => updateCartHours(item.id, Number(e.target.value))}
                    className="border rounded px-2 py-1"
                  >
                    {Array.from({ length: 99 }, (_, i) => i + 1).map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="col-span-4 text-right">
                <div className="text-sm text-gray-500">Line total</div>
                <div className="text-xl font-semibold">₹{item.lineTotal}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Subtotal</div>
            <div className="text-2xl font-bold">₹{subtotal}</div>
          </div>

          <div className="flex gap-4">
            <button
              className="bg-green-700 text-white px-4 py-2 rounded"
              onClick={() => {
                // confirm booking (demo)
                alert("Booking confirmed (demo).");
                emptyCart();
              }}
            >
              Confirm Booking
            </button>

            <button className="border px-4 py-2 rounded" onClick={() => { /* navigate or just close */ }}>
              Continue browsing
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
