import React from 'react';

export default function Header({ currentPage, onNavigate, authUser, cartCount, onLogout }) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">🍔 Food Ordering System</h1>
            <p className="text-blue-100 mt-1">Inventory-driven menu and cart checkout</p>
            {authUser && (
              <p className="text-blue-100 mt-2">
                Signed in as <span className="font-bold">{authUser.username}</span>{' '}
                <span className="ml-2 bg-white text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {authUser.role === 'manager' ? '👔 Manager' : '👤 Customer'}
                </span>
              </p>
            )}
          </div>
        </div>

        <nav className="flex flex-wrap gap-2">
          {!authUser && (
            <>
              <button
                onClick={() => onNavigate('login')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentPage === 'login'
                    ? 'bg-white text-blue-700'
                    : 'bg-blue-500 hover:bg-blue-400 text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('register')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentPage === 'register'
                    ? 'bg-white text-blue-700'
                    : 'bg-blue-500 hover:bg-blue-400 text-white'
                }`}
              >
                Register
              </button>
            </>
          )}

          {authUser && authUser.role === 'customer' && (
            <>
              <button
                onClick={() => onNavigate('menu')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentPage === 'menu'
                    ? 'bg-white text-blue-700'
                    : 'bg-blue-500 hover:bg-blue-400 text-white'
                }`}
              >
                🍕 Menu
              </button>
              <button
                onClick={() => onNavigate('cart')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentPage === 'cart'
                    ? 'bg-white text-blue-700'
                    : 'bg-blue-500 hover:bg-blue-400 text-white'
                }`}
              >
                🛒 Cart ({cartCount})
              </button>
              <button
                onClick={() => onNavigate('orders')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentPage === 'orders'
                    ? 'bg-white text-blue-700'
                    : 'bg-blue-500 hover:bg-blue-400 text-white'
                }`}
              >
                📋 My Orders
              </button>
            </>
          )}

          {authUser && authUser.role === 'manager' && (
            <>
              <button
                onClick={() => onNavigate('inventory')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentPage === 'inventory'
                    ? 'bg-white text-blue-700'
                    : 'bg-blue-500 hover:bg-blue-400 text-white'
                }`}
              >
                📦 Inventory
              </button>
              <button
                onClick={() => onNavigate('order_management')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentPage === 'order_management'
                    ? 'bg-white text-blue-700'
                    : 'bg-blue-500 hover:bg-blue-400 text-white'
                }`}
              >
                📊 Orders
              </button>
            </>
          )}

          {authUser && (
            <button
              onClick={onLogout}
              className="ml-auto px-4 py-2 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white transition"
            >
              🚪 Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
