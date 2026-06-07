/** MenuPage — customer product grid; App.jsx filters out archived items */
import React from 'react';
import ProductCard from './ProductCard';

export default function MenuPage({ products, addToCart }) {
  return (
    <section className="py-8 px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Menu</h2>
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No products available right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={addToCart} />
          ))}
        </div>
      )}
    </section>
  );
}
