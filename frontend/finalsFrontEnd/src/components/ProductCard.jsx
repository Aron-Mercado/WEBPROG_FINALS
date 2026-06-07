/** ProductCard — one menu item with Add to Cart button */
import React, { useState } from 'react';

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

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden transition transform hover:shadow-lg ${
        isOutOfStock ? 'opacity-60' : ''
      }`}
    >
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-2xl font-bold text-green-600 mb-3">${priceNum.toFixed(2)}</p>
        <p className="text-gray-600 mb-4">
          Stock: <span className={stockNum > 5 ? 'text-green-600 font-bold' : stockNum > 0 ? 'text-yellow-600 font-bold' : 'text-red-600 font-bold'}>{stockNum}</span>
        </p>
        {isOutOfStock ? (
          <span className="inline-block w-full text-center bg-red-100 text-red-700 py-2 rounded font-semibold">
            Out of Stock
          </span>
        ) : (
          <div className="space-y-3">
            <input
              type="number"
              min="1"
              max={stockNum}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAdd}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
