import { api } from "./axios"

interface crearPrivilegiosUsuarioProps {
  nombre: string, 
  mail: string, 
  tipo: string, 
  basicos: boolean, 
  avanzados: boolean, 
  asignaturas: boolean
}

interface crearPrivilegiosAulaProps {
  nombre: string, 
  aula: string,
  basicos: boolean, 
  avanzados: boolean
}

interface crearPrivilegiosAsignaturaProps {
  nombre: string, 
  nombreAsignatura: string,
  curso: number,
  basicos: boolean, 
  avanzados: boolean
}


interface crearPrivilegiosGrupoAsignaturaProps {
    nombre:string,
    nombreAsignatura:string,
    curso:number, 
    grupo:string,
    tipo:string,
    basicos:boolean,
    avanzados:boolean,
    profesores:boolean
}


interface darPrivilegiosProps {
    mail:string,
    nombreGrupo:string,
    tipoUsuario:string, 
    fechaFin:string
}
interface quitarPrivilegiosProps {
    mail:string,
    nombreGrupo:string,
    tipoUsuario:string
}
interface GetGrupoPrivilegiosProps {
    id:string
}

export const crearPrivilegiosUsuario = async (props: crearPrivilegiosUsuarioProps) => {
    const token = localStorage.getItem("token");
    const response = await api.post('/privilegios/Usuario/Crear', 
      props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  return response;
};
export const crearPrivilegiosAula = async (props: crearPrivilegiosAulaProps) => {
    const token = localStorage.getItem("token");
    const response = await api.post('/privilegios/Aula/Crear', 
      props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  return response;
};
export const crearPrivilegiosAsignatura = async (props: crearPrivilegiosAsignaturaProps) => {
    const token = localStorage.getItem("token");
    const response = await api.post('/privilegios/Asignatura/Crear', 
      props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  return response;
};
export const crearPrivilegiosGrupoAsignatura = async (props: crearPrivilegiosGrupoAsignaturaProps) => {
    const token = localStorage.getItem("token");
    const response = await api.post('/privilegios/GrupoAsignatura/Crear', 
      props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  return response;
};
export const darPrivilegios = async (props: darPrivilegiosProps) => {
    const token = localStorage.getItem("token");
    const response = await api.put('/privilegios/addMiembro', 
      props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  return response;
};
export const quitarPrivilegios = async (props: quitarPrivilegiosProps) => {
    const token = localStorage.getItem("token");
    const response = await api.put('/privilegios/eliminarMiembro', 
      props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  return response;
};

export const GetGrupoPrivilegios = async (props: GetGrupoPrivilegiosProps) => {
    const token = localStorage.getItem("token");
    const response = await api.post('/privilegios/Get/GrupoPrivilegiado', 
      props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  return response.data;
};