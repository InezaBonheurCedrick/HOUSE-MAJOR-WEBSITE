const API_BASE_URL = 'https://house-major-website-qgs3.onrender.com';

class InvestmentService {
  // Get all investments (public)
  async getAllInvestments() {
    try {
      const response = await fetch(`${API_BASE_URL}/investments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch investments');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching investments:', error);
      throw error;
    }
  }

  // Get investment by ID (public)
  async getInvestmentById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/investments/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch investment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching investment:', error);
      throw error;
    }
  }

  // Create investment (admin only)
  async createInvestment(investmentData, token) {
    try {
      console.log('Investment Service - Creating with token:', token ? `Bearer ${token.substring(0, 20)}...` : 'No token');
      
      const response = await fetch(`${API_BASE_URL}/investments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(investmentData),
      });

      console.log('Investment Service - Create response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Investment Service - Create error:', errorData);
        throw new Error(errorData.message || 'Failed to create investment');
      }

      const data = await response.json();
      console.log('Investment Service - Created successfully:', data);
      return data;
    } catch (error) {
      console.error('Investment Service - Create error:', error);
      throw error;
    }
  }

  // Update investment (admin only)
  async updateInvestment(id, investmentData, token) {
    try {
      console.log('Investment Service - Updating with token:', token ? `Bearer ${token.substring(0, 20)}...` : 'No token');
      
      const response = await fetch(`${API_BASE_URL}/investments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(investmentData),
      });

      console.log('Investment Service - Update response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Investment Service - Update error:', errorData);
        throw new Error(errorData.message || 'Failed to update investment');
      }

      const data = await response.json();
      console.log('Investment Service - Updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Investment Service - Update error:', error);
      throw error;
    }
  }

  // Delete investment (admin only)
  async deleteInvestment(id, token) {
    try {
      console.log('Investment Service - Deleting with token:', token ? `Bearer ${token.substring(0, 20)}...` : 'No token');
      
      const response = await fetch(`${API_BASE_URL}/investments/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Investment Service - Delete response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Investment Service - Delete error:', errorData);
        throw new Error(errorData.message || 'Failed to delete investment');
      }

      const data = await response.json();
      console.log('Investment Service - Deleted successfully:', data);
      return data;
    } catch (error) {
      console.error('Investment Service - Delete error:', error);
      throw error;
    }
  }
    async submitInvestmentInquiry(inquiryData) {
    try {
      console.log('Investment Service - Submitting public inquiry');
      
      const response = await fetch(`${API_BASE_URL}/investments/inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryData),
      });

      console.log('Investment Service - Inquiry response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Investment Service - Inquiry error:', errorData);
        throw new Error(errorData.message || 'Failed to submit investment inquiry');
      }

      const data = await response.json();
      console.log('Investment Service - Inquiry submitted successfully:', data);
      return data;
    } catch (error) {
      console.error('Investment Service - Inquiry error:', error);
      throw error;
    }
  }


}

export default new InvestmentService();