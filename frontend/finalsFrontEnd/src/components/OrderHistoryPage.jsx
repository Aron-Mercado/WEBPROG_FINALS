import React from 'react';

export default function OrderHistoryPage({ orders, role, onUpdateStatus }) {
  if (!orders || orders.length === 0) {
    return (
      <section className="py-8 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          {role === 'manager' ? 'Order Management' : 'My Orders'}
        </h2>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-600">No orders yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        {role === 'manager' ? 'Order Management' : 'My Orders'}
      </h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Order #{order.id}</h3>
                <p className="text-gray-600">
                  {order.username && <span>Customer: <strong>{order.username}</strong></span>}
                </p>
                <p className="text-gray-600">Placed: {new Date(order.created_at).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600">${Number(order.total_price).toFixed(2)}</p>
                <p className={`text-sm font-semibold mt-2 px-3 py-1 rounded inline-block ${
                  order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </p>
              </div>
            </div>

            <div className="px-6 py-4">
              <h4 className="font-bold text-gray-700 mb-3">Items:</h4>
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="text-left px-3 py-2 font-semibold">Product</th>
                    <th className="text-left px-3 py-2 font-semibold">Price</th>
                    <th className="text-left px-3 py-2 font-semibold">Qty</th>
                    <th className="text-left px-3 py-2 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2">{item.name || `Product ${item.product_id}`}</td>
                      <td className="px-3 py-2">${Number(item.price).toFixed(2)}</td>
                      <td className="px-3 py-2">{item.quantity}</td>
                      <td className="px-3 py-2 font-semibold">${(Number(item.price) * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {role === 'manager' && (
              <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
                <label className="font-semibold text-gray-700">Update Status:</label>
                <select
                  value={order.status}
                  onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
