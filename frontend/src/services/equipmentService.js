import API from './api';

export const equipmentService = {
  getAll: async (params = {}) => {
    const response = await API.get('/equipment', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await API.get(`/equipment/${id}`);
    return response.data;
  },

  getMyEquipment: async () => {
    const response = await API.get('/equipment/my');
    return response.data;
  },

  create: async (formData) => {
    // If formData is an instance of FormData, send multipart headers
    const headers = formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await API.post('/equipment', formData, { headers });
    return response.data;
  },

  update: async (id, formData) => {
    const headers = formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await API.put(`/equipment/${id}`, formData, { headers });
    return response.data;
  },

  delete: async (id) => {
    const response = await API.delete(`/equipment/${id}`);
    return response.data;
  },

  getRecommendations: async (query = '') => {
    const response = await API.get('/equipment/recommendations', { params: { query } });
    return response.data;
  },

  getGlobalStats: async () => {
    const response = await API.get('/equipment/stats/global');
    return response.data;
  }
};
