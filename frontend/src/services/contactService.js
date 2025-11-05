const API_BASE_URL = 'https://house-major-website-qgs3.onrender.com';

class ContactService {
  async submitContact(contactData) {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit contact form');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  }

  async getAllContacts(token) {
    try {      
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch contacts: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(' Contact Service - Error:', error);
      throw error;
    }
  }

  async getContactById(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch contact');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching contact:', error);
      throw error;
    }
  }

  async deleteContact(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete contact');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }
}

export default new ContactService();