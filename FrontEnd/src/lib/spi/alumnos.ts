import { api } from "./axios";

interface CrearAlumnoProps {
  nombre:string,
  mail: string,
  password: string
}
interface DeleteAlumnoProps {
  mail: string
}
interface AsignarAlumnosProps {
  mail: string,
  nombre: string,
  curso: number,
  tipo: string,
  grupo: string
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
export const DeleteAlumno= async ( props: DeleteAlumnoProps ) => {
    const token = localStorage.getItem("token");
    const response = await api.post('/alumnos/Eliminar', 
            props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  return response;
};
export const AñadirAlumno= async ( props: AsignarAlumnosProps ) => {
    const token = localStorage.getItem("token");
    const response = await api.put('/asignaturas/Grupo/Alumno/Add', 
      props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  return response;
};
export const QuitarAlumno= async ( props: AsignarAlumnosProps ) => {
    const token = localStorage.getItem("token");
    const response = await api.put('/asignaturas/Grupo/Alumno/Remove', 
      props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  return response;
};