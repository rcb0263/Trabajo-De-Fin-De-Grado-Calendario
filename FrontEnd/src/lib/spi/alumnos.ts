import { api } from "./axios";

interface CrearAlumnoProps {
  nombre:string,
  mail: string,
  password: string
}
export const CrearAlumno = async ( props: CrearAlumnoProps ) => {
    const token = localStorage.getItem("token");
    const response = await api.post('/alumnos/Crear', 
            props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  return response;
};