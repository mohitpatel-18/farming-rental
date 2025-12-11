// src/components/ProductCard.jsx
import React, { useState, useEffect } from "react";
import { useShop } from "../context/ShopContext";
import { Link } from "react-router-dom";

/**
 * ProductCard
 * Props:
 *  - product: { id, name, category, hourlyRate, image, ... }
 *  - showViewLink (optional)
 */
export default function ProductCard({ product, showViewLink = true }) {
  const { addToCart } = useShop();
  const [hours, setHours] = useState(1);         // selected hours (1..99)
  const [total, setTotal] = useState(product.hourlyRate || 0);

  useEffect(() => {
    const r = Number(product.hourlyRate || 0);
    setTotal(r * Number(hours || 1));
  }, [hours, product.hourlyRate]);

  function handleAddToCart() {
    // pass hours as qty to cart
    addToCart(product, Number(hours || 1));
    // small visual feedback could be added (toast) — omitted for brevity
  }

  return (
    <div className="bg-white border rounded shadow-sm overflow-hidden">
      <div className="h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <div className="text-sm text-gray-600">{product.category}</div>

        <div className="mt-3 flex items-center gap-4">
          <div>
            <div className="text-sm text-gray-500">Rate</div>
            <div className="text-xl font-bold">₹{product.hourlyRate}/hr</div>
          </div>

          {/* Hours selector */}
          <div className="ml-auto flex items-center gap-2">
            <label className="text-sm text-gray-600 mr-1">Hours</label>
            <select
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {Array.from({ length: 99 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Total</div>
            <div className="text-lg font-semibold">₹{total}</div>
          </div>

          <div className="flex items-center gap-3">
            {showViewLink && (
              <Link to={`/product/${product.id}`} className="px-3 py-1 border rounded hover:bg-gray-50">
                View
              </Link>
            )}

            <button onClick={handleAddToCart} className="px-3 py-1 bg-green-700 text-white rounded">
              Rent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
