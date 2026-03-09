// src/lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  timeout: 10000,
});

// Otomatis sisipkan token JWT di setiap request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 → redirect ke login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Account API ──────────────────────────────────────────
export const accountAPI = {
  getAll:    (params) => api.get('/api/accounts', { params }),
  getById:   (id)     => api.get(`/api/accounts/${id}`),
  getPopular:()       => api.get('/api/accounts/popular'),
  create:    (data)   => api.post('/api/accounts', data),
  delete:    (id)     => api.delete(`/api/accounts/${id}`),
  wishlist:  (id)     => api.post(`/api/accounts/${id}/wishlist`),
};

// ── Auth API ─────────────────────────────────────────────
export const authAPI = {
  login:    (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/register', data),
  me:       ()     => api.get('/api/auth/me'),
};

// ── Order API ─────────────────────────────────────────────
export const orderAPI = {
  create:  (data) => api.post('/api/orders', data),
  getAll:  ()     => api.get('/api/orders'),
  getById: (id)   => api.get(`/api/orders/${id}`),
  cancel:  (id)   => api.patch(`/api/orders/${id}/cancel`),
};

// ── User API ──────────────────────────────────────────────
export const userAPI = {
  getWishlist: () => api.get('/api/users/me/wishlist'),
  getAccounts: () => api.get('/api/users/me/accounts'),
  update:   (data) => api.patch('/api/users/me', data),
};

// ── Upload API ────────────────────────────────────────────
export const uploadAPI = {
  image: (file) => {
    const form = new FormData();
    form.append('image', file);
    return api.post('/api/upload/image', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

export default api;
