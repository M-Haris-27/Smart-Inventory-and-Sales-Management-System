import api from './api';

export const adminService = {
    getUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    updateUserRole: async (id, role) => {
        const response = await api.put(`/admin/users/${id}/role`, { role });
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    },

    getDashboard: async () => {
        const response = await api.get('/admin/dashboard');
        return response.data;
    },

    getReports: async (params) => {
        const response = await api.get('/admin/reports', { params });
        return response.data;
    },
};
