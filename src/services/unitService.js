import api from '@/utils/api';

export const unitService = {
  // Obtener unidad asignada a un chofer
  async getDriverUnit(driverId) {
    try {
      const response = await api.get(`/units/driver/${driverId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener unidad');
    }
  },

  // Obtener partes de una unidad
  async getUnitParts(unitId) {
    try {
      const response = await api.get(`/parts/unit/${unitId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener partes');
    }
  }
}; 