/** CartPage — adjust quantities; passes enriched line items from App */
import React from 'react';

export default function CartPage({ items, updateCart, removeFromCart, goToCheckout }) {
  const total = items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <section className="py-8 px-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h2>
      {items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-600">Your cart is empty. Add items from the menu.</p>
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
                  <th className="text-left px-6 py-4 font-bold text-gray-700">Subtotal</th>
                  <th className="text-left px-6 py-4 font-bold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const price = Number(item.price) || 0;
                  const stockMax = item.stock !== undefined ? Number(item.stock) : 999;
                  const subtotal = price * item.quantity;
                  return (
                    <tr key={item.product_id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                      <td className="px-6 py-4 text-gray-700">${price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          min="1"
                          max={stockMax}
                          value={item.quantity}
                          onChange={(e) => updateCart(item.product_id, Number(e.target.value))}
                          className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">${subtotal.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-medium transition"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="flex justify-between items-center mb-6">
              <p className="text-xl font-bold text-gray-800">Cart Total:</p>
              <p className="text-3xl font-bold text-blue-600">${total.toFixed(2)}</p>
            </div>
            <button
              onClick={goToCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </section>
  );
}
