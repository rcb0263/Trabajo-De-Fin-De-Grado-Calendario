'use client'


import { SetStateAction, useEffect, useState } from "react";
import { Excepcion, GrupoAsignatura, GrupoPrivilegioTipo, Hora, Sesion, SesionAula } from "@/types";
import { GetGrupoPrivilegios } from "@/lib/spi/privilegios";
import "./style.css"
import { ListaPrivilegios } from "@/componentes/ListaPrivilegiosNombres";
import { AñadirAlumno, DeleteAlumno } from "@/lib/spi/alumnos";
import { AñadirProfesor, QuitarProfesor } from "@/lib/spi/profesor";
import { DetallePrivilegios } from "@/componentes/DetallePrivilegios";
import { PrivilegiosGrupoAsignatura } from "@/componentes/crear/FormularioCrearPrivilegios/GrupoAsignatura";
import { CrearExcepcion, EliminarExcepcion, EliminarSesion, GetAsignaturaById } from "@/lib/spi/asignaturas";
import { CrearSesionComponente } from "./CrearSesion";
import { CrearHorarioComponente } from "./CrearHorario";

type Props = {
  grupoData: Asignaturacomp;
  curso: number,
  nombre: string,
  grupo: string,
  tipo: string
  setCambio: React.Dispatch<React.SetStateAction<boolean>>;
  cambio: boolean
};
type Asignaturacomp = GrupoAsignatura & {
  privilegios: GrupoPrivilegioTipo[]
}
export const GrupoDetalle = (params: Props) => {

  const {grupoData, curso, nombre, tipo, grupo, cambio, setCambio} = params
  const [gruposPrivilegiados, setGruposPrivilegiados] = useState<GrupoPrivilegioTipo[]>([]);
  const [privilegio, setPrivilegio] = useState<GrupoPrivilegioTipo | null>(null);
  const [derecha, setDerecha] = useState<string>('')
  const urlBase =window.location.pathname;


  useEffect(() => {
    const GetPrivilegios = async () => {
      try {
        setGruposPrivilegiados(grupoData.privilegios);
      } catch (e) {
        
      }
    };
    if (grupoData?.privilegios?.length) {
      GetPrivilegios();
    } else {     
      setGruposPrivilegiados([]);
    }
  }, [grupoData, cambio]);


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
            setCambio={setCambio}/>
          
          <ListaUsuarios
            usuarios={grupoData.alumnos}
            curso={curso}
            nombre={nombre} 
            tipo={tipo} 
            grupo={grupo} 
            tipoUsuario="Alumnos"
            setCambio={setCambio}/>

          <ListaPrivilegios 
            privilegios={gruposPrivilegiados}
            setDerecha={setDerecha}
            setCambio={setCambio}
            setPrivilegio={setPrivilegio}
            tipo={grupoData.tipo}
          />
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
              />
          </div>
          <div>
              <ListaFechas 
              fechas={grupoData.fechas}
              tipoExcepcion='grupo'
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
      {nombre && derecha=='crearPrivilegio' && 
        <PrivilegiosGrupoAsignatura 
        data={{
          grupo: grupo, 
          nombreAsignatura: nombre, 
          curso: curso, 
          tipo: tipo,
          setCambio: setCambio
        }}
        />
      }
      {derecha=='detallePrivilegios' && privilegio && 
      <DetallePrivilegios 
      privilegio={privilegio} 
      tipo={'Grupo'} 
      nombreObjetivo={nombre}
      />}
      {derecha=='crearSesion' && 
      <CrearSesionComponente data={{
        curso,
        tipo,
        grupo,
        nombre,
        setCambio: setCambio
      }}/>}
      {derecha=='crearExcepcion' &&
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
type ListaUsuariosProps = {
  usuarios: string[];
  tipo: string,
  curso: number
  nombre: string,
  grupo: string,
  tipoUsuario: string,
  tipoAcceso?:string 
  setCambio: React.Dispatch<React.SetStateAction<boolean>>;
};
export const ListaUsuarios = ({usuarios, tipo, curso, nombre, grupo, tipoUsuario, tipoAcceso, setCambio}: ListaUsuariosProps) =>{
  const [add, setAdd]= useState<boolean>(false)
  const [mail, setMail]= useState<string>('')
  useEffect(()=>{
    setAdd(false)
  },[usuarios])
  return(
    
    <div className="lista">
      <div className="titulo-row">
        <h4>{tipoUsuario}</h4>
        {
        (!tipoAcceso ||tipoAcceso=='Admin')&&<button className="row-button"
          onClick={()=>{
            setAdd(!add)
          }}
        >Añadir</button>
        }
      </div>
      <div>
        {add && 
        <div className="usuario-row">
            <input
            value={mail}
            placeholder="mail"
            onChange={e=>{setMail(e.target.value)}}
            />
            { (!tipoAcceso ||tipoAcceso=='Admin')&&<button className="row-button" 
              onClick={async () => {
                if(tipoUsuario=='Profesores'){
                  await AñadirProfesor({
                    mail,
                    nombre,
                    curso,
                    tipo,
                    grupo
                  })
                }else if(tipoUsuario=='Alumnos'){
                  await AñadirAlumno({
                    mail,
                    nombre,
                    curso,
                    tipo,
                    grupo
                  })
                }
                setCambio(true)
              }}>Añadir {tipoUsuario}</button>}
        </div>}
        {usuarios.map((e) => (
          <div className="usuario-row" key={e}>
            <h4>{e}</h4>
            { (!tipoAcceso ||tipoAcceso=='Admin')&&
            <button className="row-button" 
              onClick={() => {
              if(tipoUsuario==='Alumnos'){  
                DeleteAlumno({
                  mail: e
                })
              }else if(tipoUsuario==='Profesores'){ 
                QuitarProfesor({
                  mail: e,
                  nombre,
                  curso,
                  tipo,
                  grupo,
                })
              }
              }}>Eliminar</button>}
          </div>
        ))}
      </div>
    
    </div>
    
  )
}

export type ListaHorariosProps = {
  tipo: string
  horarios: Sesion[]|SesionAula[],
  tipoAcceso?:string 
  data?:{
  tipo: string,
  curso: number
  nombre: string,
  grupo: string,
  setDerecha: React.Dispatch<React.SetStateAction<string>>;
  setCambio: React.Dispatch<React.SetStateAction<boolean>>;
  }

};
export const formatearHora = (h:Hora) =>{
  const hora = h.hora<10?('0'+h.hora):h.hora
  const minuto = h.minuto<10?('0'+h.minuto):h.minuto
  return (hora+':'+minuto)
};
export const ListaHorarios = ({horarios, data, tipo, tipoAcceso}: ListaHorariosProps) => {

return (
    <div className="lista">
     <div className="titulo-row">
        <h4>Horarios</h4>
        {(!tipoAcceso ||tipoAcceso=='Admin')&&tipo == "aula" &&  (<button 
        className="row-button" 
        onClick={()=>{
          data?.setDerecha('crearSesion')
          data?.setCambio(true)
        }}
        >Añadir</button>)}
      </div>

      {horarios?.length ? (
        <div >
          {horarios.map((h, i) => {

            return (
            <div className="horario-card" key={i}>
             <div>

                <p><strong>Día:</strong> {h.dia}</p>
                {"aula" in h && (<p><strong>Aula:</strong> {h.aula}</p>)}
                {"asignatura" in h && (
                  <p><strong>Asignatura:</strong> {h.asignatura}</p>
                  )}
                <p>
                  <strong>Duración:</strong>{" "}
                  {formatearHora(h.horaInicio)} - {formatearHora(h.horaFin)}
                </p>
             </div>
             {(!tipoAcceso ||tipoAcceso=='Admin')&& "aula" in h && 
             (<button onClick={()=>{
              EliminarSesion({
                curso: data!.curso,
                tipo: data!.tipo,
                grupo: data!.grupo,
                nombre: data!.nombre,
                aula: h.aula,
                dia: h.dia,
                horaInicio: h.horaInicio,
                horaFin: h.horaFin
              })
              data?.setCambio(true)
             }}>Eliminar</button>)}
            </div>
            
          )})}
        </div>
      ) : (
        <p>—</p>
      )}
    </div>
  );
};

type ListaFechasProps = {
  fechas: Excepcion[];
  tipoExcepcion: string,
  data?:{
  tipo: string,
  curso: number
  nombre: string,
  grupo: string,
  cambio: boolean
  setDerecha: React.Dispatch<React.SetStateAction<string>>;
  setCambio: React.Dispatch<React.SetStateAction<boolean>>;
  }
}

export const ListaFechas = ({ fechas, data, tipoExcepcion}: ListaFechasProps) => {
    useEffect(()=>{
    },[data?.cambio])
  return (
    <div className="lista">
      <div className="titulo-row">
        <h4>Fechas</h4>
        { tipoExcepcion == "grupo" &&  (<button 
        className="row-button" 
        onClick={()=>{
          data?.setDerecha('crearExcepcion')
          data?.setCambio(true)
        }}
        >Añadir</button>)}
      </div>
      {fechas?.length ? (
        <div>
           
          {fechas.map((fecha, i) => (
            <div className="horario-card" key={i}>
              <div className="horario-info">
                <p><strong>Fecha:</strong> {fecha.fecha}</p>
                <p><strong>Aula:</strong> {fecha.aula}</p>
                <p>
                  <strong>Duración:</strong>{" "}
                  {formatearHora(fecha.horaInicio)} - {formatearHora(fecha.horaFin)}
                </p>
              </div>

              <button 
              className="row-button eliminar-btn"
              onClick={()=>{
              EliminarExcepcion({
                curso: data!.curso,
                tipo: data!.tipo,
                grupo: data!.grupo,
                nombre: data!.nombre,
                aula: fecha.aula,
                fecha: fecha.fecha,
                horaInicio: fecha.horaInicio,
                horaFin: fecha.horaFin
              }).then(()=>{
                data?.setCambio(true)
              })
              
             }}>
                Eliminar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>—</p>
      )}
    </div>
  );
};