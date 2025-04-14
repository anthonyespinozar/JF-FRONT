import environment from '../config/environment';
import { authService } from './authService';
import api, { makeGetRequest, makePostRequest, makePutRequest } from '@/utils/api';

import { toast } from 'sonner';


export const userService = {

  // Obtener usuarios (endpoint protegido)
  async getUsers() {
    try {
      return await makeGetRequest('users');
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener usuarios');
    }
  },

  // Actualizar usuario
  async updateUser(id, userData) {
    try {
      const response = await makePutRequest(`users/${id}`, userData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al actualizar usuario');
    }
  },

  // Activar/Desactivar usuario
  async toggleUserStatus(id, activo) {
    try {
      const response = await makePutRequest(`users/${id}/status`, { activo });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al cambiar estado del usuario');
    }
  },

  // Crear usuario
  async createUser(userData) {
    try {
      const response = await makePostRequest('users', userData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al crear usuario');
    }
  }
};

export default userService;

const handleUpdateUser = async (values) => {
  try {
    const dataToSubmit = {
      ...values,
      password: values.password || undefined
    }
    await userService.updateUser(selectedUser.id, dataToSubmit)
    // ...
  } catch (error) {
    toast.error(error.message)
  }
}

