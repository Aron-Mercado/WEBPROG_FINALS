/** CartPage — adjust quantities; passes enriched line items from App */
import React from 'react';

export default function CartPage({ items, updateCart, removeFromCart, goToCheckout }) {
  const total = items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <section className="page-wrap max-w-4xl">
      <div className="mb-8">
        <h2 className="page-title">Your cart</h2>
        <p className="page-subtitle">Review items before checkout</p>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <p>Your cart is empty. Head to the menu to add something tasty.</p>
        </div>
      ) : (
        <>
          <div className="card overflow-hidden mb-6">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const price = Number(item.price) || 0;
                  const stockMax = item.stock !== undefined ? Number(item.stock) : 999;
                  const subtotal = price * item.quantity;
                  return (
                    <tr key={item.product_id}>
                      <td className="font-medium text-slate-800">{item.name}</td>
                      <td>${price.toFixed(2)}</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          max={stockMax}
                          value={item.quantity}
                          onChange={(e) => updateCart(item.product_id, Number(e.target.value))}
                          className="input-field w-20 py-2 text-center"
                        />
                      </td>
                      <td className="font-semibold text-slate-800">${subtotal.toFixed(2)}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product_id)}
                          className="btn-danger-soft"
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

          <div className="summary-strip">
            <div className="flex justify-between items-center mb-5">
              <p className="text-lg font-semibold text-slate-700">Cart total</p>
              <p className="text-3xl font-bold text-teal-700">${total.toFixed(2)}</p>
            </div>
            <button type="button" onClick={goToCheckout} className="btn-primary-full">
              Proceed to checkout
            </button>
          </div>
        </>
      )}
    </section>
  );
}
