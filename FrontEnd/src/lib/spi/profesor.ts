import { api } from "./axios";

interface CrearProfesorProps {
  nombre:string,
  mail: string,
  password: string
}
export const CrearProfesor = async ( props: CrearProfesorProps ) => {
    const token = localStorage.getItem("token");
    const response = await api.post('/profesores/Crear', 
            props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
    return response;
};