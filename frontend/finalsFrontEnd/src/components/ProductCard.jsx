/** ProductCard — one menu item with Add to Cart button */
import React, { useState } from 'react';

function foodEmoji(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('pizza')) return '🍕';
  if (n.includes('burger')) return '🍔';
  if (n.includes('sandwich') || n.includes('chicken')) return '🥪';
  if (n.includes('fries') || n.includes('french')) return '🍟';
  if (n.includes('cola') || n.includes('drink') || n.includes('soda')) return '🥤';
  if (n.includes('salad')) return '🥗';
  if (n.includes('coffee')) return '☕';
  return '🍽️';
}

export default function ProductCard({ product, onAdd }) {
  const [quantity, setQuantity] = useState(1);
  const stockNum = Number(product.stock) || 0;
  const priceNum = Number(product.price) || 0;
  const isOutOfStock = stockNum <= 0;

  const handleAdd = () => {
    if (quantity > 0 && !isOutOfStock) {
      onAdd(product.id, quantity);
      setQuantity(1);
    }
  };

  const stockClass =
    stockNum > 5 ? 'text-teal-600' : stockNum > 0 ? 'text-amber-600' : 'text-rose-600';

  return (
    <article
      className={`card-padded flex flex-col h-full transition hover:shadow-md ${
        isOutOfStock ? 'opacity-70' : ''
      }`}
    >
      <div className="food-placeholder" aria-hidden="true">
        {foodEmoji(product.name)}
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-1">{product.name}</h3>
      <p className="text-2xl font-bold text-teal-600 mb-2">${priceNum.toFixed(2)}</p>
      <p className="text-sm text-slate-500 mb-4">
        In stock: <span className={`font-bold ${stockClass}`}>{stockNum}</span>
      </p>

      {isOutOfStock ? (
        <span className="badge-danger text-center py-2 mt-auto">Out of stock</span>
      ) : (
        <div className="space-y-3 mt-auto">
          <input
            type="number"
            min="1"
            max={stockNum}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="input-field py-2"
            aria-label={`Quantity for ${product.name}`}
          />
          <button type="button" onClick={handleAdd} className="btn-primary-full">
            Add to cart
          </button>
        </div>
      )}
    </article>
  );
}
