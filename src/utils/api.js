"use server";

import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import environment from "@/config/environment";

const BASE_URL = environment.url_backend;
console.log('API Base URL configurada:', BASE_URL);

if (!BASE_URL) {
  console.error('¡ADVERTENCIA! BASE_URL no está configurada');
}

// Constantes para las rutas de la API
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  // ... otras rutas
};

const api = axios.create({
  baseURL: BASE_URL,
  maxContentLength: 50 * 1024 * 1024,
  maxBodyLength: 50 * 1024 * 1024,
});

// Middleware para verificar autenticación
const withAuth = async (requestFunction) => {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error("No autorizado - Sesión no encontrada");
  }
  
  return requestFunction(session);
};

// Funciones de API mejoradas
export const makeGetRequest = async (url, params = {}) => {
  return withAuth(async (session) => {
    try {
      const response = await api.get(url, {
        params,
        headers: {
          Authorization: `Bearer ${session.user.backendTokens.accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error en petición GET:", {
        url,
        error: error.message,
        response: error.response?.data
      });
      throw error;
    }
  });
};

export const makePostRequest = async (url, data = {}) => {
  return withAuth(async (session) => {
    try {
      const response = await api.post(url, data, {
        headers: {
          Authorization: `Bearer ${session.user.backendTokens.accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error en petición POST:", {
        url,
        data,
        error: error.message,
        response: error.response?.data
      });
      throw error;
    }
  });
};

// Función para obtener headers de autenticación
const getAuthHeaders = () => {
  try {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch (error) {
    console.warn("Error accediendo a localStorage:", error);
    return {};
  }
};

// Interceptor para peticiones
api.interceptors.request.use(
  (config) => {
    const authHeaders = getAuthHeaders();
    config.headers = {
      ...config.headers,
      ...authHeaders,
    };
    
    // Log de la petición saliente
    const logInfo = {
      url: `${config.baseURL}${config.url}`,
      method: config.method?.toUpperCase(),
      data: config.data,
      headers: config.headers
    };
    
    console.log('📤 Petición saliente:', logInfo);
    return config;
  },
  (error) => {
    console.error('❌ Error en interceptor de petición:', {
      message: error.message,
      config: error.config
    });
    return Promise.reject(error);
  }
);

// Interceptor para respuestas
api.interceptors.response.use(
  (response) => {
    // Log de respuesta exitosa
    console.log('📥 Respuesta exitosa:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Log detallado del error
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    };
    
    console.error('❌ Error en respuesta:', errorDetails);
    return Promise.reject({
      ...error,
      details: errorDetails
    });
  }
);

// Método GET mejorado
export const getRequest = async (url, params = {}) => {
  try {
    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('Error en getRequest:', {
      url,
      params,
      error: error.message,
      response: error.response?.data
    });
    throw error;
  }
};

// Método PUT mejorado
export const putRequest = async (url, data = {}) => {
  try {
    const response = await api.put(url, data);
    return response.data;
  } catch (error) {
    console.error('Error en putRequest:', {
      url,
      data,
      error: error.message,
      response: error.response?.data
    });
    throw error;
  }
};

// Método DELETE mejorado
export const deleteRequest = async (url) => {
  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    console.error('Error en deleteRequest:', {
      url,
      error: error.message,
      response: error.response?.data
    });
    throw error;
  }
};

export default api;
