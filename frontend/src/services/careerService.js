import axios from 'axios';

const API_BASE_URL = 'https://house-major-website.onrender.com';

const careerService = {
  // Get all careers
  async getCareers() {
    try {
      const response = await axios.get(`${API_BASE_URL}/careers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching careers:', error);
      throw error;
    }
  },

  // Get career by ID
  async getCareerById(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/careers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching career:', error);
      throw error;
    }
  },

  // Submit application with file upload
  async submitApplication(applicationData, file) {
    try {
      const formData = new FormData();
      
      // Append all application data
      Object.keys(applicationData).forEach(key => {
        if (applicationData[key] !== null && applicationData[key] !== undefined) {
          formData.append(key, applicationData[key]);
        }
      });
      
      // Append the file if it exists
      if (file) {
        formData.append('resume', file);
      }

      const response = await axios.post(`${API_BASE_URL}/upload-application`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
  },

  // General application (without specific careerId)
  async submitGeneralApplication(applicationData, file) {
    try {
      const formData = new FormData();
      
      // Append all application data with careerId as null
      Object.keys(applicationData).forEach(key => {
        if (applicationData[key] !== null && applicationData[key] !== undefined) {
          formData.append(key, key === 'careerId' ? null : applicationData[key]);
        }
      });
      
      // Append the file if it exists
      if (file) {
        formData.append('resume', file);
      }

      const response = await axios.post(`${API_BASE_URL}/upload-application`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting general application:', error);
      throw error;
    }
  },

  // Create new career (Admin only)
  async createCareer(careerData) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${API_BASE_URL}/careers`, careerData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating career:', error);
      throw error;
    }
  },

  // Update career (Admin only)
  async updateCareer(id, careerData) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`${API_BASE_URL}/careers/${id}`, careerData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating career:', error);
      throw error;
    }
  },

  // Delete career (Admin only)
  async deleteCareer(id) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.delete(`${API_BASE_URL}/careers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting career:', error);
      throw error;
    }
  },

  // Get all applications (Admin only)
  async getApplications() {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },

  // Delete application (Admin only)
  async deleteApplication(id) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.delete(`${API_BASE_URL}/applications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  },

  // Accept application (Admin only)
  async acceptApplication(id) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`${API_BASE_URL}/applications/${id}/accept`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error accepting application:', error);
      throw error;
    }
  },

  // Reject application (Admin only)
  async rejectApplication(id) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`${API_BASE_URL}/applications/${id}/reject`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error rejecting application:', error);
      throw error;
    }
  }
};

export default careerService;