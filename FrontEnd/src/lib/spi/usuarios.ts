import { api } from "./axios";


interface GetUsuarioProps{
  id?: string,
  mail?: string,
  tipo: string
}
interface EliminarUsuarioProps{
  id: string,
  tipo: string
}
interface userFromTokenProps{
  tipo: string
}

export const userFromToken= async ( props: userFromTokenProps ) => {
    const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

    const response = await api.post('/'+ (props.tipo === 'Profesor' ? 'profesores' : 'alumnos') + '/GetUserIdFromToken', 
      props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  return response.data;
};
export const GetUsuario = async ( props: GetUsuarioProps ) => {
      const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

    const url = props.tipo == 'Profesor'? '/profesores/getProfesor': '/alumnos/getAlumno'
    const response = await api.post(url, 
    props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
    return response.data;
};

export const EliminarUsuario = async ( props: EliminarUsuarioProps ) => {
      const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

    const url = props.tipo == 'Profesor'? '/profesores/Eliminar': '/alumnos/Eliminar'
    const response = await api.delete(url, {
      data: props,
      headers: {
        authorization: token,
      },
    });
    return response.data;
};