import React from "react";
export default function PlaceOrder(){
  return (
    <main className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold mb-4">Place Order</h1>
      <p>Checkout demo — connect your backend to process orders.</p>
      <a href="/orders" className="mt-4 inline-block px-4 py-2 bg-farmGreen text-white rounded">Go to Orders</a>
    </main>
  );
}
