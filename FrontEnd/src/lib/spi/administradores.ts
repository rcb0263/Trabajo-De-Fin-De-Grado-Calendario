import { api } from "./axios";

interface CrearAdminProps {
  nombre:string,
  mail: string,
  password: string
}
interface AñadirAdminProps {
  mail: string,
}
interface isAdminPops {
  token: string,
}
interface UsuarioCorrectoProps {
  id: string,
}
export const CrearAdmin = async ( props: CrearAdminProps ) => {
      const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

    const response = await api.post('/privilegios/CrearAdministrador', 
            props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  return response;
};
//const token = localStorage.getItem("token");
export const AñadirAdmin = async ( props: AñadirAdminProps ) => {
  const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
    const response = await api.put('/privilegios/addAdmin', 
            props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  return response;
};
export const EliminarAdmin = async ( props: AñadirAdminProps ) => {
    const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
    const response = await api.put('/privilegios/ElimAdmin', 
      props,
      {
        headers: {
          authorization: `${token}`,
        },
      }
  );
  return response;
};

export const isAdmin = async ( props: isAdminPops ) => {
    const token = props.token;
    const response = await api.post('/auth/esAdmin',
      {},
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  return response;
};
export const UsuarioCorrecto = async ( props: UsuarioCorrectoProps ) => {
  const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
  const response = await api.post('/auth/verificarUsuario',
    props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  return response;
};

