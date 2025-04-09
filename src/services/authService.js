import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const authService = {
    // Register new user
    register: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, userData);
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Registration failed';
        }
    },

    // Login user
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Login failed';
        }
    },

    // Logout user
    logout: async () => {
        try {
            await axios.post(`${API_URL}/auth/logout`);
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Logout error:', error);
            // Still remove user from localStorage even if API call fails
            localStorage.removeItem('user');
        }
    },

    // Get current user
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Update user profile
    updateProfile: async (uid, userData) => {
        try {
            const response = await axios.put(`${API_URL}/users/${uid}`, userData);
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                const updatedUser = { ...currentUser, ...response.data };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Profile update failed';
        }
    },

    // Get user profile
    getProfile: async (uid) => {
        try {
            const response = await axios.get(`${API_URL}/users/${uid}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Failed to get profile';
        }
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        const user = authService.getCurrentUser();
        return !!user;
    },

    // Check if user has specific role
    hasRole: (requiredRole) => {
        const user = authService.getCurrentUser();
        return user && user.role === requiredRole;
    }
};

// Add axios interceptor for authentication
axios.interceptors.request.use(
    (config) => {
        const user = authService.getCurrentUser();
        if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default authService;
