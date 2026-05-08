import { api } from "./axios"

export const horarioProfesor = async (mail: string) => {
      const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

    const response = await api.post('/profesores/GetHorarios', 
            { mail },
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
    return response.data.asignaturasConHorario;
};