import { api } from "./axios"

export const horarioProfesor = async (mail: string) => {
    const token = localStorage.getItem("token");
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