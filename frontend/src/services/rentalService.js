import API from './api';

export const rentalService = {
  create: async (rentalData) => {
    const response = await API.post('/rentals', rentalData);
    return response.data;
  },

  getMyRequests: async () => {
    const response = await API.get('/rentals/my-requests');
    return response.data;
  },

  getOwnerRequests: async () => {
    const response = await API.get('/rentals/owner-requests');
    return response.data;
  },

  getById: async (id) => {
    const response = await API.get(`/rentals/${id}`);
    return response.data;
  },

  approve: async (id) => {
    const response = await API.put(`/rentals/${id}/approve`);
    return response.data;
  },

  reject: async (id, reason = '') => {
    const response = await API.put(`/rentals/${id}/reject`, { reason });
    return response.data;
  },

  cancel: async (id) => {
    const response = await API.put(`/rentals/${id}/cancel`);
    return response.data;
  },

  complete: async (id) => {
    const response = await API.put(`/rentals/${id}/complete`);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await API.get('/rentals/dashboard-stats');
    return response.data;
  }
};
