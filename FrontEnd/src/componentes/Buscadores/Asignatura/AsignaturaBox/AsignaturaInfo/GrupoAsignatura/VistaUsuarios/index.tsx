'use client'


import { useEffect, useState } from "react";
import { GrupoAsignaturacomp} from "@/types";
import { ListaFechas, ListaHorarios, ListaUsuarios } from "..";
import { CrearSesionComponente } from "../CrearSesion";
import { CrearHorarioComponente } from "../CrearHorario";

type Props = {
  grupoData: GrupoAsignaturacomp;
  curso: number,
  nombre: string,
  grupo: string,
  tipo: string
  usuario: string,
  setCambio: React.Dispatch<React.SetStateAction<boolean>>;
  cambio: boolean
};
export const GrupoDetalleUsuarios = (params: Props) => {

  const {grupoData, curso, nombre, tipo, grupo, usuario, setCambio, cambio} = params
  const tipoAcceso='profesor';
  const [derecha, setDerecha] = useState<string>('')
  useEffect(()=>{

  },[params.cambio])

  return (
    <div className="ContenedorObjetoYPrivilegios">
          
      <div className="grupo-detalle">
        <h2>{nombre}</h2>
        <h3>{grupoData.tipo} Grupo {grupoData.grupo}</h3>
        <div className="seccion-grupos">
          <ListaUsuarios 
            usuarios={grupoData.profesores} 
            curso={curso} 
            nombre={nombre} 
            tipo={tipo} 
            grupo={grupo} 
            tipoUsuario="Profesores"
            tipoAcceso={tipoAcceso}
            setCambio={setCambio}/>
          
          <ListaUsuarios
            usuarios={grupoData.alumnos}
            curso={curso}
            nombre={nombre} 
            tipo={tipo} 
            grupo={grupo} 
            tipoUsuario="Alumnos"
            tipoAcceso={tipoAcceso}
            setCambio={setCambio}/>
          <div>
              <ListaHorarios
              tipo = {"aula"}  
              horarios={grupoData.horarios}
              data={{
                tipo,
                curso,
                nombre,
                grupo,
                setDerecha,
                setCambio,
              }}
                tipoAcceso={tipoAcceso}
              />
          </div>
          <div>
              <ListaFechas 
              fechas={grupoData.fechas}
              tipoExcepcion="grupo"
              data={{
                tipo,
                curso,
                nombre,
                grupo,
                cambio,
                setDerecha,
                setCambio,
              }}
              />
          </div>
        </div>
      </div>
      {false && derecha=='crearSesion' && 
      <CrearSesionComponente data={{
        curso,
        tipo,
        grupo,
        nombre,
        setCambio: setCambio
      }}/>}
      {usuario=='Profesor' && derecha=='crearExcepcion' &&
      <>
      <CrearHorarioComponente data={{
        curso,
        tipo,
        grupo,
        nombre,
        setCambio: setCambio
      }}/>
      </>}
    </div>
  );
};