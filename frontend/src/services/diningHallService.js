import api from './api';

export const diningHallService = {
  async getAll(params = {}) {
    const res = await api.get('/dining-halls', params);
    return res.data;
  },

  async getById(id) {
    const res = await api.get(`/dining-halls/${id}`);
    return res.data;
  },

  async create(data) {
    const res = await api.post('/dining-halls', data);
    return res.data;
  },

  async update(id, data) {
    const res = await api.put(`/dining-halls/${id}`, data);
    return res.data;
  },

  async delete(id) {
    const res = await api.delete(`/dining-halls/${id}`);
    return res.data;
  }
};

export default diningHallService;
