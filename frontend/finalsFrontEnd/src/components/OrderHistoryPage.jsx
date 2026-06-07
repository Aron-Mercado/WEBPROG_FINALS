/** OrderHistoryPage — customer "My Orders" or manager status dropdown */
import React from 'react';

function statusBadge(status) {
  if (status === 'Completed') return 'badge-success';
  if (status === 'Processing') return 'badge-brand';
  if (status === 'Cancelled') return 'badge-danger';
  return 'badge-warn';
}

export default function OrderHistoryPage({ orders, role, onUpdateStatus }) {
  const title = role === 'manager' ? 'Order management' : 'My orders';

  if (!orders || orders.length === 0) {
    return (
      <section className="page-wrap">
        <h2 className="page-title mb-8">{title}</h2>
        <div className="empty-state">
          <p>No orders yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page-wrap">
      <div className="mb-8">
        <h2 className="page-title">{title}</h2>
        <p className="page-subtitle">
          {role === 'manager' ? 'Track and update customer orders' : 'Your past and current orders'}
        </p>
      </div>

      <div className="space-y-5">
        {orders.map((order) => (
          <article key={order.id} className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Order #{order.id}</h3>
                {order.username && (
                  <p className="text-sm text-slate-500 mt-1">
                    Customer: <span className="font-semibold text-slate-700">{order.username}</span>
                  </p>
                )}
                <p className="text-sm text-slate-500">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-2xl font-bold text-teal-700">
                  ${Number(order.total_price).toFixed(2)}
                </p>
                <span className={`${statusBadge(order.status)} mt-2`}>{order.status}</span>
              </div>
            </div>

            <div className="px-5 py-4">
              <h4 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
                Items
              </h4>
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
                  {order.items?.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name || `Product ${item.product_id}`}</td>
                      <td>${Number(item.price).toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td className="font-semibold">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {role === 'manager' && (
              <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <label className="text-sm font-semibold text-slate-600">Update status</label>
                <select
                  value={order.status}
                  onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                  className="input-field max-w-xs py-2"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
