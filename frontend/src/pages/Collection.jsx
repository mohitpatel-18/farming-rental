import React from "react";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";

export default function Collection(){
  const { products } = useShop();
  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-serif mb-6">Equipment Collection</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </main>
  );
}
