import { makeGetRequest, makePostRequest, makePutRequest, makeDeleteRequest } from '@/utils/api';

export const unitService = {
  // Obtener todos las unidades
  async getAllUnits() {
    try {
      const response = await makeGetRequest("/units");
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener unidades');
    }
  },

  // Obtener unidad asignada a un chofer}
  async getDriverUnit(driverId) {
    try {
      const response = await makeGetRequest(`/units/driver/${driverId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener unidad');
    }
  },

  // Obtener partes de una unidad
  async getUnitParts(unitId) {
    try {
      const response = await makeGetRequest(`/parts/unit/${unitId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener partes');
    }
  }
}; 