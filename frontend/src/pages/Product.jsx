import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useShop } from "../context/ShopContext";

export default function Product() {
  const { id } = useParams();
  const { products, addToCart } = useShop();

  const product = products.find((p) => p.id === id);

  const [hours, setHours] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (product) {
      setTotal(Number(product.hourlyRate) * Number(hours));
    }
  }, [hours, product]);

  if (!product) return <div className="p-10 text-center">Loading...</div>;

  function handleAddToCart() {
    addToCart(product, hours);
    alert("Added to cart!");
  }

  function handleRentNow() {
    addToCart(product, hours);
    window.location.href = "/cart"; // redirect to cart
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col lg:flex-row gap-10">

        {/* Product Image */}
        <div className="flex-1">
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg shadow"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-serif font-bold">{product.name}</h1>

          <div className="mt-2 text-gray-600 text-lg">{product.category}</div>

          {/* Hourly Rate */}
          <div className="mt-4 text-xl font-semibold">
            ₹{product.hourlyRate} <span className="text-gray-500 text-base">/ hour</span>
          </div>

          {/* Hours Selector */}
          <div className="mt-6">
            <label className="text-sm text-gray-700 mr-2 font-medium">
              Select Hours:
            </label>

            <select
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="border px-3 py-2 rounded-md"
            >
              {Array.from({ length: 99 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          {/* Total Price */}
          <div className="mt-4">
            <div className="text-sm text-gray-500">Total Price</div>
            <div className="text-2xl font-bold text-green-700">₹{total}</div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={handleAddToCart}
              className="px-6 py-3 bg-green-700 text-white rounded-md shadow hover:bg-green-800 transition"
            >
              Add to Cart
            </button>

            <button
              onClick={handleRentNow}
              className="px-6 py-3 border-2 border-green-700 text-green-700 rounded-md shadow hover:bg-green-50 transition"
            >
              Rent Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}