import { create } from 'zustand';
import api from '../api/axios';

const authStore = (set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  // Signup
  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/signup', userData);
      const { token, _id, name, email, campus } = response.data;
      const user = { _id, name, email, campus };
      localStorage.setItem('token', token);
      set({ token, user, isLoading: false, error: null });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || 'Signup failed';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, _id, name, email, campus } = response.data;
      const user = { _id, name, email, campus };
      localStorage.setItem('token', token);
      set({ token, user, isLoading: false, error: null });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || 'Login failed';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, error: null });
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!get().token;
  },

  // Hydrate from localStorage on app load
  hydrate: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      set({ token });
      try {
        const res = await api.get('/users/profile');
        set({ user: res.data });
      } catch (error) {
        localStorage.removeItem('token');
        set({ token: null, user: null });
      }
    }
  }
});

export const useAuthStore = create(authStore);