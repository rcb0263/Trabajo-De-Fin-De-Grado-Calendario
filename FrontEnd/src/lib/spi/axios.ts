import axios from 'axios';

export const api = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 5000
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    switch (status) {
      case 400:
        console.warn("otro error o no autenticado");
        break;

      case 401:
        console.warn("Sesión expirada o no autenticado");
        break;

      case 402:
        console.warn("Permisos insuficientes");
        break;

      case 403:
        console.warn("Acceso denegado");
        break;

      default:
        console.error("Error de API:", error);
        break;
    }

    // Mantiene el error para que el componente decida qué hacer
    return Promise.reject(error);
  }
);