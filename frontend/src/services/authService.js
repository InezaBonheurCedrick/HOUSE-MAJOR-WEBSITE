import axios from 'axios';

const API_BASE_URL = 'https://house-major-website.onrender.com';

const authService = {
  // Register new user
  async register(userData) {
    try {
      const registerData = {
        username: userData.fullName || userData.email.split('@')[0],
        email: userData.email,
        password: userData.password
      };
      const response = await axios.post(`${API_BASE_URL}/auth/register`, registerData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Login user
  async login(credentials) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: credentials.email,
        password: credentials.password
      });
      
      if (response.data.data?.token) {
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('userEmail', credentials.email);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Logout user
  async logout() {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      // Optional: await axios.post(`${API_BASE_URL}/auth/logout`);
      return { status: "success", message: "Logged out successfully" };
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      throw error.response?.data || { message: 'Logout failed' };
    }
  },

  // --- ADDED: Forgot Password ---
  async forgotPassword(emailData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, emailData);
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error.response?.data || { message: 'Failed to send reset token' };
    }
  },

  // --- ADDED: Reset Password ---
  async resetPassword(resetData) {
    try {
      // Backend expects { email, token, newPassword }
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, resetData);
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error.response?.data || { message: 'Failed to reset password' };
    }
  },

  // Get current user token
  getToken() {
    return localStorage.getItem('authToken');
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    // Optional: Add JWT expiration check here
    return true;
  },

  // Get stored user email
  getUserEmail() {
    return localStorage.getItem('userEmail');
  },

  async updateProfile(profileData) {
  try {
    const token = this.getToken();
    const response = await axios.post(`${API_BASE_URL}/auth/profile`, profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
      }, 
    });
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Update profile failed';
    throw { message: errorMessage };
  }
},

// Create new admin user
async createAdminUser(userData) {
  try {
    const token = this.getToken();
    const response = await axios.post(`${API_BASE_URL}/auth/admin/users`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Create admin user error:', error);
    throw error.response?.data || { message: 'Create user failed' };
  }
},

// Get all admin users
async getAdminUsers() {
  try {
    const token = this.getToken();
    const response = await axios.get(`${API_BASE_URL}/auth/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get admin users error:', error);
    throw error.response?.data || { message: 'Failed to fetch users' };
  }
},

// Delete admin user
async deleteAdminUser(userId) {
  try {
    const token = this.getToken();
    const response = await axios.delete(`${API_BASE_URL}/auth/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Delete admin user error:', error);
    throw error.response?.data || { message: 'Failed to delete user' };
  }
}
};

export default authService;