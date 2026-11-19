export const API_URL = import.meta.env.VITE_API_URL ?? '';

const getToken = () => sessionStorage.getItem('adminToken') || '';

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'x-admin-token': token }),
    },
    ...options,
  });
  if (res.status === 204) return null;
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(body?.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.errors = body?.errors;
    throw err;
  }
  return body;
}

export const api = {
  create: (data) => request('/api/items', { method: 'POST', body: JSON.stringify(data) }),
  remove: (id) => request(`/api/items/${id}`, { method: 'DELETE' }),
  sendContact: (data) => request('/api/contact', { method: 'POST', body: JSON.stringify(data) }),
};
