import React, { useEffect, useMemo, useState } from 'react';
import MenuPage from './components/MenuPage';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import OrderHistoryPage from './components/OrderHistoryPage';
import InventoryPage from './components/InventoryPage';
import {
  fetchProducts,
  submitOrder,
  loginUser,
  registerUser,
  fetchOrders,
  createProduct,
  updateProduct,
  deleteProduct,
  updateOrderStatus,
} from './services/api';

const pages = {
  LOGIN: 'login',
  REGISTER: 'register',
  MENU: 'menu',
  CART: 'cart',
  CHECKOUT: 'checkout',
  ORDERS: 'orders',
  INVENTORY: 'inventory',
  ORDER_MANAGEMENT: 'order_management',
};

export default function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState(pages.LOGIN);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  const persistAuth = (user, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthUser(user);
  };

  const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuthUser(null);
    setPage(pages.LOGIN);
  };

  const loadProducts = async (includeArchived = false) => {
    setLoading(true);
    const data = await fetchProducts(includeArchived);
    if (Array.isArray(data)) {
      setProducts(data);
    } else {
      setMessage(data.error || 'Unable to load products');
      setProducts([]);
    }
    setLoading(false);
  };

  const loadOrders = async () => {
    setLoading(true);
    const data = await fetchOrders();
    if (Array.isArray(data)) {
      setOrders(data);
    } else {
      setMessage(data.error || 'Unable to load orders');
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken');
    if (storedUser && storedToken) {
      setAuthUser(JSON.parse(storedUser));
      setPage(pages.MENU);
    }

    loadProducts(false);
  }, []);

  const handleLogin = async (credentials) => {
    setLoading(true);
    const response = await loginUser(credentials);
    setLoading(false);

    if (response && response.success) {
      persistAuth(response.user, response.token);
      setMessage(`Welcome back, ${response.user.username}!`);
      setPage(response.user.role === 'manager' ? pages.INVENTORY : pages.MENU);
      if (response.user.role === 'manager') {
        await loadProducts(true);
        await loadOrders();
      }
      return;
    }

    setMessage(response?.error || 'Login failed. Please try again.');
  };

  const handleRegister = async (credentials) => {
    setLoading(true);
    const response = await registerUser(credentials);
    setLoading(false);

    if (response && response.success) {
      persistAuth(response.user, response.token);
      setMessage(`Account created. Welcome, ${response.user.username}!`);
      setPage(pages.MENU);
      await loadProducts();
      return;
    }

    setMessage(response?.error || 'Registration failed. Please try again.');
  };

  const updateCart = (productId, quantity) => {
    setCart((current) => {
      if (quantity <= 0) {
        return current.filter((item) => item.product_id !== productId);
      }
      const existing = current.find((item) => item.product_id === productId);
      if (!existing) {
        return [...current, { product_id: productId, quantity }];
      }
      return current.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item
      );
    });
  };

  const addToCart = (productId, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.product_id === productId);
      if (existing) {
        return current.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: Math.min(item.quantity + quantity, 999) }
            : item
        );
      }
      return [...current, { product_id: productId, quantity }];
    });
    setPage(pages.CART);
  };

  const removeFromCart = (productId) => {
    setCart((current) => current.filter((item) => item.product_id !== productId));
  };

  const handleCheckout = async () => {
    if (!authUser) {
      setMessage('Please sign in before placing an order.');
      setPage(pages.LOGIN);
      return;
    }

    if (cart.length === 0) {
      setMessage('Your cart is empty. Add items before checkout.');
      return;
    }

    setLoading(true);
    const response = await submitOrder({ items: cart });
    setLoading(false);

    if (response && response.success) {
      const totalFormatted = Number(response.total_price) || 0;
      setMessage(`Order #${response.order_id} placed successfully! Total: $${totalFormatted.toFixed(2)}`);
      setCart([]);
      await loadProducts(false);
      if (authUser?.role === 'manager') {
        await loadProducts(true);
        await loadOrders();
      }
      setPage(pages.MENU);
      return;
    }

    setMessage(response?.error || 'Checkout failed. Please try again.');
  };

  const handleCreateProduct = async (productData) => {
    setLoading(true);
    const response = await createProduct(productData);
    setLoading(false);

    if (response && response.success) {
      setMessage('Product created successfully.');
      await loadProducts(true);
      return;
    }

    setMessage(response?.error || 'Could not create product.');
  };

  const handleUpdateProduct = async (productData) => {
    setLoading(true);
    const payload = {
      name: String(productData.name).trim(),
      price: Number(productData.price),
      stock: parseInt(productData.stock, 10),
      archived: Number(productData.archived) === 1 ? 1 : 0,
    };
    const response = await updateProduct(productData.id, payload);
    setLoading(false);

    if (response && response.success) {
      setMessage('Product updated successfully.');
      await loadProducts(true);
      return;
    }

    setMessage(response?.error || 'Could not update product.');
  };

  const handleDeleteProduct = async (productId) => {
    setLoading(true);
    const response = await deleteProduct(productId);
    setLoading(false);

    if (response && response.success) {
      setMessage('Product deleted successfully.');
      await loadProducts(true);
      return;
    }

    setMessage(response?.error || 'Could not delete product.');
  };

  const handleOrderStatus = async (orderId, status) => {
    setLoading(true);
    const response = await updateOrderStatus(orderId, status);
    setLoading(false);

    if (response && response.success) {
      setMessage('Order status updated.');
      await loadOrders();
      return;
    }

    setMessage(response?.error || 'Could not update order status.');
  };

  const currentCartItems = useMemo(
    () =>
      cart.map((item) => {
        const product = products.find((product) => product.id === item.product_id);
        return {
          ...item,
          name: product?.name || 'Unknown',
          price: Number(product?.price) || 0,
          stock: product?.stock ?? 0,
        };
      }),
    [cart, products]
  );

  const handleNavigate = (targetPage) => {
    setMessage('');
    setPage(targetPage);
    if (targetPage === pages.ORDERS) {
      loadOrders();
    }

    if (targetPage === pages.INVENTORY || targetPage === pages.ORDER_MANAGEMENT) {
      loadProducts(true);
      loadOrders();
    }
  };

  return (
    <div className="app-shell">
      <Header
        currentPage={page}
        onNavigate={handleNavigate}
        authUser={authUser}
        cartCount={cart.length}
        onLogout={clearAuth}
      />

      <main>
        {message && <div className="message-box">{message}</div>}
        {loading && <div className="loading">Loading...</div>}

        {!authUser && page === pages.LOGIN && (
          <LoginPage
            onLogin={handleLogin}
            onSwitchToRegister={() => setPage(pages.REGISTER)}
            loading={loading}
          />
        )}

        {!authUser && page === pages.REGISTER && (
          <RegisterPage
            onRegister={handleRegister}
            onSwitchToLogin={() => setPage(pages.LOGIN)}
            loading={loading}
          />
        )}

        {authUser && authUser.role === 'customer' && page === pages.MENU && (
          <MenuPage
            products={products.filter((p) => Number(p.archived) !== 1)}
            addToCart={addToCart}
          />
        )}

        {authUser && authUser.role === 'customer' && page === pages.CART && (
          <CartPage
            items={currentCartItems}
            updateCart={updateCart}
            removeFromCart={removeFromCart}
            goToCheckout={() => setPage(pages.CHECKOUT)}
          />
        )}

        {authUser && authUser.role === 'customer' && page === pages.CHECKOUT && (
          <CheckoutPage
            items={currentCartItems}
            onConfirm={handleCheckout}
            onGoBack={() => setPage(pages.CART)}
          />
        )}

        {authUser && page === pages.ORDERS && (
          <OrderHistoryPage
            orders={orders}
            role={authUser.role}
            onUpdateStatus={handleOrderStatus}
          />
        )}

        {authUser && authUser.role === 'manager' && page === pages.INVENTORY && (
          <InventoryPage
            products={products}
            onCreateProduct={handleCreateProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            loading={loading}
          />
        )}

        {authUser && authUser.role === 'manager' && page === pages.ORDER_MANAGEMENT && (
          <OrderHistoryPage
            orders={orders}
            role={authUser.role}
            onUpdateStatus={handleOrderStatus}
          />
        )}
      </main>
    </div>
  );
}
