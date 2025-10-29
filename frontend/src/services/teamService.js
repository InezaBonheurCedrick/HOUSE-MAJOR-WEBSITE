import axios from "axios";

const API_URL = "https://house-major-website.onrender.com/team"; // adjust if deployed

const teamService = {
  // Fetch all team members
  async getAll() {
    const res = await axios.get(API_URL);
    return res.data;
  },

  // Fetch single member (if needed later)
  async getById(id) {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },

  // Create a new team member (admin only)
  async create(data, token) {
    const res = await axios.post(API_URL, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },

  // Update existing member
  async update(id, data, token) {
    const res = await axios.put(`${API_URL}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },

  // Delete member
  async remove(id, token) {
    const res = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },
};

export default teamService;
