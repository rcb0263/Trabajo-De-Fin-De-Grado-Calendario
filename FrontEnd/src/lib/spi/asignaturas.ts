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
interface GetAsignaturaProps{
  nombre: string,
  curso: number,
}
interface GetGrupoAsignaturaProps{
  curso: number,
  nombre: string,
  tipo: string,
  grupo: string
}
interface DeleteAsignaturaProps{
  nombre: string,
  curso: number  
}
interface DeleteGrupoAsignaturaProps{
  nombre: string,
  curso: number,
  grupo:string,
  tipo: string
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
export const GetAsignatura = async ( props: GetAsignaturaProps ) => {
    const token = localStorage.getItem("token");
    const response = await api.post('/asignaturas/getAsignatura', 
    props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
    return response.data;
};
export const GetGrupoAsignatura = async ( props: GetGrupoAsignaturaProps ) => {
    const token = localStorage.getItem("token");
    const response = await api.post('/asignaturas/getGrupoAsignatura', 
    props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
    return response.data;
};

export const DeleteAsignatura = async (props: DeleteAsignaturaProps) => {
    const token = localStorage.getItem("token");
    console.log(token)
    const response = await api.delete('/asignaturas/Eliminar', {
      data: props,
      headers: {
        authorization: `${token}`,
      },
    });
  console.log(response)
  return response.data;
};
export const DeleteGrupoAsignatura = async (props: DeleteGrupoAsignaturaProps) => {
    const token = localStorage.getItem("token");
    const response = await api.put('/asignaturas/Grupo/Eliminar', 
      props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  return response.data;
};
