/** Header — top nav; shows different links for guest, customer, or manager */
import React from 'react';

const customerLinks = [
  { id: 'menu', label: 'Menu' },
  { id: 'cart', label: 'Cart', showCount: true },
  { id: 'orders', label: 'My Orders' },
];

const managerLinks = [
  { id: 'inventory', label: 'Inventory' },
  { id: 'order_management', label: 'Orders' },
];

const guestLinks = [
  { id: 'login', label: 'Sign In' },
  { id: 'register', label: 'Register' },
];

function NavButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={active ? 'btn-nav btn-nav-active' : 'btn-nav btn-nav-inactive'}
    >
      {children}
    </button>
  );
}

export default function Header({ currentPage, onNavigate, authUser, cartCount, onLogout }) {
  const links = !authUser
    ? guestLinks
    : authUser.role === 'manager'
      ? managerLinks
      : customerLinks;

  return (
    <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-1">
              Fresh & fast
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Byte<span className="text-teal-600">Bistro</span>
            </h1>
            {authUser ? (
              <p className="text-slate-500 text-sm mt-1">
                Hello, <span className="font-semibold text-slate-700">{authUser.username}</span>
                <span className={`ml-2 badge ${authUser.role === 'manager' ? 'badge-brand' : 'badge-muted'}`}>
                  {authUser.role === 'manager' ? 'Manager' : 'Customer'}
                </span>
              </p>
            ) : (
              <p className="text-slate-500 text-sm mt-1">Order in, enjoy out</p>
            )}
          </div>

          {authUser && (
            <button type="button" onClick={onLogout} className="btn-danger self-start sm:self-center">
              Logout
            </button>
          )}
        </div>

        <nav className="flex flex-wrap gap-2">
          {links.map((link) => (
            <NavButton
              key={link.id}
              active={currentPage === link.id}
              onClick={() => onNavigate(link.id)}
            >
              {link.label}
              {link.showCount && cartCount > 0 ? ` (${cartCount})` : ''}
            </NavButton>
          ))}
        </nav>
      </div>
    </header>
  );
}
