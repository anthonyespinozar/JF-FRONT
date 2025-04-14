import api from '@/utils/api';

export const maintenanceService = {
  // Obtener mantenimientos por unidad
  async getMaintenancesByUnit(unidadId) {
    try {
      const response = await api.get(`/maintenances/unit/${unidadId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener mantenimientos');
    }
  },

  // Registrar nuevo mantenimiento
  async createMaintenance(maintenanceData) {
    try {
      const response = await api.post('/maintenances', maintenanceData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al crear mantenimiento');
    }
  },

  // Obtener detalles de un mantenimiento
  async getMaintenanceDetails(maintenanceId) {
    try {
      const response = await api.get(`/maintenances/${maintenanceId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener detalles');
    }
  }
}; 