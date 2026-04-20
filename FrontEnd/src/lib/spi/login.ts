import { api } from "./axios"





export const loginProfesor = async (mail: string, password: string) => {
    const response = await api.post('/profesores/Login', {
        mail,
        password
    });
    return response.data;
};
export const loginAlumno = async (mail: string, password: string) => {
    const response = await api.post('/alumnos/Login', {
        mail,
        password
    });
    return response.data;
};
export const loginAdmin = async (mail: string, password: string) => {
    const response = await api.post('/admin/Login', {
        mail,
        password
    });
    return response.data;
};