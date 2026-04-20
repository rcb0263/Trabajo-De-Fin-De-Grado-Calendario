import { api } from "./axios"

interface HorarioSemanaProps {
    nombre: string,
    curso: number,
    año: number,
    grado: string,
    semestre: string
}

export const crearAsignatura = async ( props: HorarioSemanaProps ) => {
    const token = localStorage.getItem("token");
    const response = await api.post('/asignaturas/Crear', 
            props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
    console.log(response)
    return response;
};