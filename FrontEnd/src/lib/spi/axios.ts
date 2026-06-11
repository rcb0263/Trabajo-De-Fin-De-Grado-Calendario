import axios from 'axios';

export const api = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 5000
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    let message = "Error inesperado";
    const url = error.config?.url;
    console.log(url)
    if (url === "/profesores/Login"||url === "/alumnos/Login"||url === "/privilegios/Login") {
      return Promise.reject(error);
    }
    if (status === 400) message = "Datos incorrectos";
    if (status === 401) message = "No autorizado";
    if (status === 402) message = "Sin permisos";
    if (status === 403) message = "Acceso denegado";

    return {
      data: null,
      error: message,
      message: error.response?.data?.message,
      status,
      ok: false,
    };
  }
);