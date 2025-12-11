import React from "react";
import ProductCard from "./ProductCard";
export default function RelatedProducts({ products = [] }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-8">
      <h4 className="font-semibold mb-4">Related Equipment</h4>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
