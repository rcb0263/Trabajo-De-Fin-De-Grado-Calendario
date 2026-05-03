import { api } from "./axios";

interface SearchAulasProps{
  nombre: string
}
export const SearchAulas = async ( props: SearchAulasProps ) => {
    const token = localStorage.getItem("token");
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