import { api } from "./axios";

interface CrearAlumnoProps {
  nombre:string,
  mail: string,
  password: string
}
interface DeleteAlumnoProps {
  id: string,
}
interface AsignarAlumnosProps {
  mail: string,
  nombre: string,
  curso: number,
  tipo: string,
  grupo: string
}
interface BuscarAlumnoProps {
  mail: string,
  tipoUsuario: string
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
    const response = await api.delete('/alumnos/Eliminar', {
      data: props,
      headers: {
        authorization: `${token}`,
      },
    });
  return response.data;
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
export const BuscarAlumnoe= async ( props: BuscarAlumnoProps ) => {
    const token = localStorage.getItem("token");
    const response = await api.post('/alumnos/SearchAlumno', 
      props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  return response.data;
};
export const BuscarAlumno= async ( props: BuscarAlumnoProps ) => {
    const token = localStorage.getItem("token");
    const response = await api.post('/alumnos/SearchAlumno', 
      props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  return response.data;
};