const API_BASE = import.meta.env.VITE_API_BASE;

if (!API_BASE) {
  console.error(
    'VITE_API_BASE is missing. Copy frontend/finalsFrontEnd/.env.example to .env and set your API URL.'
  );
}

function authHeaders() {
  const token = localStorage.getItem('authToken');
  return token
    ? {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    : { 'Content-Type': 'application/json' };
}

async function handleResponse(response) {
  const responseClone = response.clone();
  try {
    const data = await response.json();
    if (!response.ok) {
      return { error: data.error || `Server error (${response.status})` };
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
  const res = await fetch(`${API_BASE}${path}`, options);
  return handleResponse(res);
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
