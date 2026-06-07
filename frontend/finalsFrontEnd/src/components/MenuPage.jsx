/** MenuPage — customer product grid; App.jsx filters out archived items */
import React from 'react';
import ProductCard from './ProductCard';

export default function MenuPage({ products, addToCart }) {
  return (
    <section className="page-wrap">
      <div className="mb-8">
        <h2 className="page-title">Our menu</h2>
        <p className="page-subtitle">Pick your favorites and add them to your cart</p>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <p>No dishes available right now. Check back soon!</p>
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
