import { Sesion } from "@/types";
import { api } from "./axios"

interface CrearAsignaturasProps {
    nombre: string,
    curso: number,
    año: number,
    grado: string,
    semestre: string
}
interface CrearGrupoAsignaturasProps {
  nombre:string,
  curso: number,
  grupo: string,
  tipo: string,
  horario: Sesion[],
}
interface SearchAsignaturasProps{
  nombre: string,
  curso: number,
  grado: string
}
export const crearAsignatura = async ( props: CrearAsignaturasProps ) => {
    const token = localStorage.getItem("token");
    const response = await api.post('/asignaturas/Crear', 
    props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
    return response;
};
export const crearGrupoAsignatura = async ( props: CrearGrupoAsignaturasProps ) => {
    const token = localStorage.getItem("token");
    const response = await api.post('/asignaturas/Grupo/Crear', 
    props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
    return response;
};
export const SearchAsignaturas = async ( props: SearchAsignaturasProps ) => {
    const token = localStorage.getItem("token");
    const response = await api.post('/asignaturas/SearchAsignaturas', 
    props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
    return response.data;
};