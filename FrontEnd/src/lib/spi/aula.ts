import { api } from "./axios";

interface SearchAulasProps{
  nombre: string
}

interface GetAulaProps{
  id?: string,
  aula?: string
}
interface EliminarAulaProps{
  aula: string
}

export const SearchAulas = async ( props: SearchAulasProps ) => {
      const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

    const response = await api.post('/aulas/SearchAulas', 
    props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
    return response.data;
};

export const GetAula = async ( props: GetAulaProps ) => {
      const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

    const response = await api.post('/aulas/GetAula', 
    props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
    return response.data;
};

export const EliminarAula = async ( props: EliminarAulaProps ) => {
      const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

    const response = await api.delete('/aulas/Eliminar', {
      data: props,
      headers: {
        authorization: token,
      },
    });
    return response.data;
};