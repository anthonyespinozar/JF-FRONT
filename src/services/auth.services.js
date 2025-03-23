"use client";

import { makePostRequest, postRequest } from "@/utils/api";

// No necesitamos saveSession porque Next-auth manejará la sesión
export const authService = {
  // Login
  login: async (email, password) => {
    try {
      console.log('🔑 Intentando login con:', { correo: email });
      
      // Usamos postRequest para login porque no requiere autenticación
      const response = await postRequest("auth/login", {
        correo: email,
        password
      });
      
      console.log('📥 Respuesta del servidor:', response);

      if (!response) {
        throw new Error('No se recibió respuesta del servidor');
      }

      if (!response.token) {
        throw new Error('No se recibió token en la respuesta');
      }

      return {
        success: true,
        user: response.user,
        token: response.token
      };
      
    } catch (error) {
      console.error('❌ Error en login:', {
        message: error.message,
        response: error.response,
        details: error.details
      });
      
      throw {
        message: error.response?.data?.message || error.message || 'Error al iniciar sesión',
        status: error.response?.status || 500,
        details: error.details || error
      };
    }
  },

  // Registro
  register: async (userData) => {
    try {
      console.log('📝 Intentando registro con:', userData);

      const formattedData = {
        correo: userData.email,
        password: userData.password,
        nombre: userData.nombre,
        rol: userData.rol
      };
      
      // Usamos postRequest para registro porque no requiere autenticación
      const response = await postRequest("auth/register", formattedData);
      
      console.log('✅ Registro exitoso:', response);
      return response;
    } catch (error) {
      console.error("❌ Error en registro:", error);
      throw {
        message: error.response?.data?.message || 'Error al registrar usuario',
        status: error.response?.status || 500,
        details: error.details || error
      };
    }
  },

  // Para peticiones autenticadas usamos makePostRequest
  updateProfile: async (userData) => {
    try {
      return await makePostRequest("auth/update-profile", userData);
    } catch (error) {
      console.error("❌ Error actualizando perfil:", error);
      throw error;
    }
  }
};

export default authService;