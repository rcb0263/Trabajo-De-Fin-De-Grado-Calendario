import { api } from "./axios";

interface CrearProfesorProps {
  nombre:string,
  mail: string,
  password: string
}
interface DeleteProfesorProps {
  mail: string
}
interface AñadirProfesorProps {
  mail: string,
  nombre: string,
  curso: number,
  tipo: string,
  grupo: string
}
interface BuscarProfesorProps {
  mail: string,
  tipoUsuario: string
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
export const DeleteProfesor= async ( props: DeleteProfesorProps ) => {
    const token = localStorage.getItem("token");
    const response = await api.post('/profesores/Eliminar', 
      props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  return response;
};
export const AñadirProfesor= async ( props: AñadirProfesorProps ) => {
    const token = localStorage.getItem("token");
    const response = await api.put('/asignaturas/Grupo/Profesor/Add', 
      props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  return response;
};
export const QuitarProfesor= async ( props: AñadirProfesorProps ) => {
    const token = localStorage.getItem("token");
    console.log(props)
    const response = await api.put('/asignaturas/Grupo/Profesor/Remove', 
      props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  return response;
};
export const BuscarProfesor= async ( props: BuscarProfesorProps ) => {
    const token = localStorage.getItem("token");
    const response = await api.post('/profesores/SearchProfesor', 
      props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );

  console.log(response)
  return response.data;
};