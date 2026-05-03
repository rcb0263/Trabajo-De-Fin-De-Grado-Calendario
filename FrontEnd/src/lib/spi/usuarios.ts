import { api } from "./axios";


interface GetUsuarioProps{
  id: string,
  tipo: string
}
interface EliminarUsuarioProps{
  id: string,
  tipo: string
}

export const GetUsuario = async ( props: GetUsuarioProps ) => {
    const token = localStorage.getItem("token");
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
    const token = localStorage.getItem("token");
    console.log('t')
    const url = props.tipo == 'Profesor'? '/profesores/Eliminar': '/alumnos/Eliminar'
    const response = await api.delete(url, {
      data: props,
      headers: {
        authorization: token,
      },
    });
    console.log(response)
    return response.data;
};