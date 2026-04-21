import { api } from "./axios"

interface crearPrivilegiosUsuario {
  nombre: string, 
  mail: string, 
  tipo: string, 
  basicos: boolean, 
  avanzados: boolean, 
  asignaturas: boolean
}

interface crearPrivilegiosAula {
  nombre: string, 
  aula: string,
  basicos: boolean, 
  avanzados: boolean
}

interface crearPrivilegiosAsignatura {
  nombre: string, 
  nombreAsignatura: string,
  curso: number,
  basicos: boolean, 
  avanzados: boolean
}


interface crearPrivilegiosGrupoAsignatura {
    nombre:string,
    nombreAsignatura:string,
    curso:number, 
    grupo:string,
    tipo:string,
    basicos:boolean,
    avanzados:boolean,
    profesores:boolean
}

export const crearPrivilegiosUsuario = async (props: crearPrivilegiosUsuario) => {
    const token = localStorage.getItem("token");
    const response = await api.post('/privilegios/Usuario/Crear', 
      props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  console.log(response)
  return response;
};
export const crearPrivilegiosAula = async (props: crearPrivilegiosAula) => {
    const token = localStorage.getItem("token");
    const response = await api.post('/privilegios/Aula/Crear', 
      props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  console.log(response)
  return response;
};
export const crearPrivilegiosAsignatura= async (props: crearPrivilegiosAsignatura) => {
    const token = localStorage.getItem("token");
    const response = await api.post('/privilegios/Asignatura/Crear', 
      props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  console.log(response)
  return response;
};
export const crearPrivilegiosGrupoAsignatura= async (props: crearPrivilegiosGrupoAsignatura) => {
    const token = localStorage.getItem("token");
    const response = await api.post('/privilegios/GrupoAsignatura/Crear', 
      props,
    {
      headers: {
        authorization: `${token}`,
      },
    }
  );
  console.log(response)
  return response;
};