import API from './api';

export const userService = {
  updateProfile: async (data) => {
    const response = await API.put('/users/profile', data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await API.put('/users/change-password', data);
    return response.data;
  }
};
