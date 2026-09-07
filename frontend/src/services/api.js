import axios from 'axios';

// API Base URL Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

// Request interceptor: Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API methods
export const authAPI = {
  // Register new user (passwordless registration)
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  // Login user and store token
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  // Request password reset email (Forgot Password)
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password using token
  resetPassword: async (data) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/me');
    if (response.data.success && response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    }
    return null;
  },
  
  // Update user profile (without photo)
  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    if (response.data.success && response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  // Update user profile with photo upload
  updateProfileWithPhoto: async (formData) => {
    const response = await api.put('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data.success && response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  // Update user password (first login & settings)
  updatePassword: async (credentials) => {
    const response = await api.put('/auth/password', credentials);
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      storedUser.mustChangePassword = false;
      localStorage.setItem('user', JSON.stringify(storedUser));
    }
    return response.data;
  },
  
  // Logout and clear auth data
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Admin API methods
export const adminAPI = {
  getStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },
  updateUserStatus: async (userId, status) => {
    const response = await api.put(`/admin/users/${userId}/status`, { status });
    return response.data;
  },
  updateUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },
  resetUserPassword: async (userId) => {
    const response = await api.post(`/admin/users/${userId}/reset-password`);
    return response.data;
  },
  getNews: async () => {
    const response = await api.get('/admin/news');
    return response.data;
  },
  createNews: async (data) => {
    const response = await api.post('/admin/news', data);
    return response.data;
  },
  updateNews: async (id, data) => {
    const response = await api.put(`/admin/news/${id}`, data);
    return response.data;
  },
  togglePublishNews: async (id, status) => {
    const response = await api.patch(`/admin/news/${id}/status`, { status });
    return response.data;
  },
  deleteNews: async (id) => {
    const response = await api.delete(`/admin/news/${id}`);
    return response.data;
  }
};

// Public News API methods
export const publicNewsAPI = {
  getNews: async (limit = 10) => {
    const response = await api.get(`/news?limit=${limit}`);
    return response.data;
  },
  getNewsById: async (id) => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  }
};

export default api;