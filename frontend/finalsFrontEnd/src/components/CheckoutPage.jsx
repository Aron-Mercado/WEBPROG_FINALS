/** CheckoutPage — order summary; Confirm calls App handleCheckout → POST /orders */
import React from 'react';

export default function CheckoutPage({ items, onConfirm, onGoBack }) {
  const total = items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <section className="py-8 px-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Order Summary & Checkout</h2>
      {items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-600">Your cart is empty. Please add items before checking out.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left px-6 py-4 font-bold text-gray-700">Product</th>
                  <th className="text-left px-6 py-4 font-bold text-gray-700">Price</th>
                  <th className="text-left px-6 py-4 font-bold text-gray-700">Quantity</th>
                  <th className="text-left px-6 py-4 font-bold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const price = Number(item.price) || 0;
                  const itemTotal = price * item.quantity;
                  return (
                    <tr key={item.product_id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                      <td className="px-6 py-4 text-gray-700">${price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-gray-700">{item.quantity}</td>
                      <td className="px-6 py-4 font-semibold text-gray-800">${itemTotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border border-green-200 mb-6">
            <div className="flex justify-between items-center">
              <p className="text-2xl font-bold text-gray-800">Order Total:</p>
              <p className="text-4xl font-bold text-green-600">${total.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onConfirm}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
            >
              ✓ Confirm Order
            </button>
            <button
              onClick={onGoBack}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-lg transition"
            >
              ← Back to Cart
            </button>
          </div>
        </>
      )}
    </section>
  );
}
