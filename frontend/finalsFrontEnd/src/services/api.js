/**
 * api.js — all HTTP calls to the PHP backend.
 * Session uses sessionStorage (clears when tab/browser closes), not localStorage.
 */

const API_BASE = import.meta.env.VITE_API_BASE;

const AUTH_TOKEN_KEY = 'authToken';
const AUTH_USER_KEY = 'user';

if (!API_BASE) {
  console.error(
    'VITE_API_BASE is missing. Copy frontend/finalsFrontEnd/.env.example to .env and set your API URL.'
  );
}

/** sessionStorage = one tab session; gone when tab/window closes */
export function clearClientSession() {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_USER_KEY);
  // Remove legacy localStorage sessions from older versions
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

function notifySessionEnded() {
  clearClientSession();
  window.dispatchEvent(new Event('session-expired'));
}

function authHeaders() {
  const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
  return token
    ? {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    : { 'Content-Type': 'application/json' };
}

async function handleResponse(response, hadToken = false) {
  const responseClone = response.clone();
  try {
    const data = await response.json();
    if (!response.ok) {
      const result = { error: data.error || `Server error (${response.status})` };
      if (response.status === 401 && hadToken) {
        result.unauthorized = true;
        notifySessionEnded();
      }
      return result;
    }
    return data;
  } catch (error) {
    const text = await responseClone.text();
    return {
      error:
        text && text.trim()
          ? `Invalid JSON response from server: ${text.trim()}`
          : `Invalid JSON response from server (${response.status})`,
    };
  }
}

async function apiFetch(path, options = {}) {
  if (!API_BASE) {
    return { error: 'API URL not configured. Set VITE_API_BASE in .env' };
  }
  const hadToken = !!sessionStorage.getItem(AUTH_TOKEN_KEY) && path !== '/login' && path !== '/register';
  try {
    const res = await fetch(`${API_BASE}${path}`, options);
    return handleResponse(res, hadToken);
  } catch {
    if (hadToken) {
      notifySessionEnded();
      return { error: 'Could not reach server. Session ended.', unauthorized: true };
    }
    return { error: 'Could not reach server. Is the API running?' };
  }
}

/** Manual logout — invalidates token on server */
export async function logoutUser() {
  const result = await apiFetch('/logout', {
    method: 'POST',
    headers: authHeaders(),
  });
  clearClientSession();
  return result;
}

/** Tab/browser close — invalidate server token (fetch keepalive runs during page unload) */
export function logoutBeacon() {
  if (!API_BASE) {
    return;
  }
  const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) {
    return;
  }
  fetch(`${API_BASE}/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    keepalive: true,
  }).catch(() => {});
}

export async function registerUser(credentials) {
  return apiFetch('/register', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(credentials),
  });
}

export async function loginUser(credentials) {
  return apiFetch('/login', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(credentials),
  });
}

export async function fetchProducts(includeArchived = false) {
  const query = includeArchived ? '?archived=1' : '';
  return apiFetch(`/products${query}`, {
    method: 'GET',
    headers: authHeaders(),
  });
}

export async function submitOrder(order) {
  return apiFetch('/orders', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(order),
  });
}

export async function fetchOrders() {
  return apiFetch('/orders', {
    method: 'GET',
    headers: authHeaders(),
  });
}

export async function updateOrderStatus(id, status) {
  return apiFetch(`/orders/status/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
}

export async function createProduct(product) {
  return apiFetch('/products', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(product),
  });
}

export async function updateProduct(id, product) {
  return apiFetch(`/products/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(product),
  });
}

export async function deleteProduct(id) {
  return apiFetch(`/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}
