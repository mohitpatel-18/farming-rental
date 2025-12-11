import React from "react";
import { useShop } from "../context/ShopContext";

export default function CartRow({ item }) {
  const { updateCartHours, removeFromCart } = useShop();

  return (
    <div className="flex items-center justify-between border-b py-4">
      <div className="flex items-center gap-4">
        {item.image ? <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" /> : <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">No</div>}
        <div>
          <div className="font-semibold">{item.title}</div>
          <div className="text-sm text-gray-600">₹{item.hourlyRate} / hr</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div>
          <label className="block text-sm">Hours</label>
          <select
            className="border rounded px-2 py-1"
            value={item.hours}
            onChange={(e) => updateCartHours(item.id, Number(e.target.value))}
          >
            {Array.from({ length: 99 }, (_, i) => i + 1).map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-500">Line total</div>
          <div className="font-semibold">₹{item.lineTotal}</div>
        </div>

        <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:underline">Remove</button>
      </div>
    </div>
  );
}
