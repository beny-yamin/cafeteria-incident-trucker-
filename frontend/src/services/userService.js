import api from './api';

export const userService = {
  async getProfile() {
    const res = await api.get('/users/profile');
    return res.data;
  },

  async updateProfile(data) {
    const res = await api.patch('/users/profile', data);
    return res.data;
  },

  async getAll(params = {}) {
    const res = await api.get('/users', params);
    return res.data;
  },

  async getInspectors(params = {}) {
    const res = await api.get('/users/inspectors', params);
    return res.data;
  },

  async updateRole(id, role) {
    const res = await api.patch(`/users/${id}/role`, { role });
    return res.data;
  },

  async assignHalls(id, hallIds) {
    const res = await api.patch(`/users/${id}/assign-halls`, { hallIds });
    return res.data;
  }
};

export default userService;
