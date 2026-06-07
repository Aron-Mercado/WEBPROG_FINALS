/** CheckoutPage — order summary; Confirm calls App handleCheckout → POST /orders */
import React from 'react';

export default function CheckoutPage({ items, onConfirm, onGoBack }) {
  const total = items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <section className="page-wrap max-w-4xl">
      <div className="mb-8">
        <h2 className="page-title">Checkout</h2>
        <p className="page-subtitle">Confirm your order summary</p>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <p>Your cart is empty. Add items before checking out.</p>
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
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const price = Number(item.price) || 0;
                  const itemTotal = price * item.quantity;
                  return (
                    <tr key={item.product_id}>
                      <td className="font-medium text-slate-800">{item.name}</td>
                      <td>${price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td className="font-semibold">${itemTotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="summary-strip mb-6">
            <div className="flex justify-between items-center">
              <p className="text-xl font-semibold text-slate-700">Order total</p>
              <p className="text-4xl font-bold text-teal-700">${total.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button type="button" onClick={onConfirm} className="btn-primary flex-1 py-3">
              Confirm order
            </button>
            <button type="button" onClick={onGoBack} className="btn-secondary flex-1 py-3">
              Back to cart
            </button>
          </div>
        </>
      )}
    </section>
  );
}
