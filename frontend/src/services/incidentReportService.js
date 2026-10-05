import api from './api';

export const incidentReportService = {
  async create(reportData) {
    const res = await api.post('/incident-reports', reportData);
    return res.data;
  },

  async getAll(params = {}) {
    const res = await api.get('/incident-reports', params);
    return res.data;
  },

  async getMyReports(params = {}) {
    const res = await api.get('/incident-reports/my-reports', params);
    return res.data;
  },

  async getById(id) {
    const res = await api.get(`/incident-reports/${id}`);
    return res.data;
  },

  async claim(id) {
    const res = await api.patch(`/incident-reports/${id}/claim`, {});
    return res.data;
  },

  async resolve(id, { inspectorNote }) {
    const res = await api.patch(`/incident-reports/${id}/resolve`, { inspectorNote });
    return res.data;
  },

  async dismiss(id, { inspectorNote }) {
    const res = await api.patch(`/incident-reports/${id}/dismiss`, { inspectorNote });
    return res.data;
  },

  async updateStatus(id, { status, inspectorNote }) {
    const res = await api.patch(`/incident-reports/${id}/status`, { status, inspectorNote });
    return res.data;
  },

  async delete(id) {
    const res = await api.delete(`/incident-reports/${id}`);
    return res.data;
  }
};

export default incidentReportService;
