'use client'


import { SetStateAction, useEffect, useState } from "react";
import { Excepcion, GrupoAsignatura, GrupoPrivilegioTipo, Hora, Sesion } from "@/types";
import { GetGrupoPrivilegios } from "@/lib/spi/privilegios";
import { useRouter } from "next/navigation";
import "./style.css"
import { ListaPrivilegios } from "@/componentes/ListaPrivilegiosNombres";
import { AñadirAlumno, DeleteAlumno } from "@/lib/spi/alumnos";
import { AñadirProfesor, QuitarProfesor } from "@/lib/spi/profesor";
import { DetallePrivilegios } from "@/componentes/DetallePrivilegios";
import { PrivilegiosGrupoAsignatura } from "@/componentes/FormularioCrearPrivilegios/GrupoAsignatura";
import { EliminarSesion } from "@/lib/spi/asignaturas";
import { CrearSesionComponente } from "./CrearSesion";

type Props = {
  grupoData: GrupoAsignatura;
  curso: number,
  nombre: string,
  grupo: string,
  tipo: string
  setCambio: React.Dispatch<React.SetStateAction<boolean>>;
  cambio: boolean
};

export const GrupoDetalle = (params: Props) => {

  const {grupoData, curso, nombre, tipo, grupo, cambio, setCambio} = params
  const [gruposPrivilegiados, setGruposPrivilegiados] = useState<GrupoPrivilegioTipo[]>([]);
  const [privilegio, setPrivilegio] = useState<GrupoPrivilegioTipo | null>(null);
  const [derecha, setDerecha] = useState<string>('')
  const urlBase =window.location.pathname;


  useEffect(() => {
    const GetPrivilegios = async () => {
      try {
        const results = await Promise.all(
          grupoData.privilegios.map((idPriv) =>
            GetGrupoPrivilegios({ id: idPriv })
          )
        );
        setGruposPrivilegiados(results);
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
        <p>cambio: {cambio}</p>
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
            urlBase={urlBase}
            setPrivilegios={setPrivilegio}
            setDerecha={setDerecha}
            setCambio={setCambio} 
            tipo={grupoData.tipo}
          />
          <div>
              <ListaHorarios 
              horarios={grupoData.horarios}
              setDerecha={setDerecha}
              curso={curso}
              nombre={nombre} 
              tipo={tipo} 
              grupo={grupo}
              setCambio={setCambio}
              />
          </div>
          <div>
              <ListaFechas fechas={grupoData.fechas}/>
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
      tipo={'Asignatura'} 
      nombreObjetivo={nombre}
      />}
      {derecha=='crearSesion' && 
      <CrearSesionComponente data={{
        curso,
        tipo,
        grupo,
        nombre
      }}/>}
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
  setCambio: React.Dispatch<React.SetStateAction<boolean>>;
};
const ListaUsuarios = ({usuarios, tipo, curso, nombre, grupo, tipoUsuario, setCambio}: ListaUsuariosProps) =>{
  const [add, setAdd]= useState<boolean>(false)
  const [mail, setMail]= useState<string>('')
  useEffect(()=>{
    setAdd(false)
  },[usuarios])
  return(
    
    <div className="lista">
      <div className="titulo-row">
        <h4>{tipoUsuario}</h4>
        <button className="row-button"
          onClick={()=>{
            setAdd(!add)
          }}
        >Añadir</button>
      </div>
      <div>
        {add && 
        <div className="usuario-row">
            <input
            value={mail}
            placeholder="mail"
            onChange={e=>{setMail(e.target.value)}}
            />
            <button className="row-button" 
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
              }}>Añadir {tipoUsuario}</button>
        </div>}
        {usuarios.map((e) => (
          <div className="usuario-row" key={e}>
            <h4>{e}</h4>
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
              }}>Eliminar</button>
          </div>
        ))}
      </div>
    
    </div>
    
  )
}

type ListaHorariosProps = {
  horarios: Sesion[],
  tipo: string,
  curso: number
  nombre: string,
  grupo: string,
  setDerecha: React.Dispatch<React.SetStateAction<string>>;
  setCambio: React.Dispatch<React.SetStateAction<boolean>>;

};
const formatearHora = (h:Hora) =>{

  return (h.hora+':'+h.minuto)
};
const ListaHorarios = ({ horarios, tipo, curso, nombre, grupo, setDerecha, setCambio }: ListaHorariosProps) => {
  return (
    <div className="lista">
     <div className="titulo-row">
        <h4>Horarios</h4>
        <button 
        className="row-button" 
        onClick={()=>{
          setDerecha('crearSesion')
          setCambio(true)
        }}
        >Añadir</button>
      </div>

      {horarios?.length ? (
        <div >
          {horarios.map((h, i) => (
            <div className="horario-card" key={i}>
             <div>
                <p><strong>Día:</strong> {h.dia}</p>
                <p><strong>Aula:</strong> {h.aula}</p>
                <p>
                  <strong>Duración:</strong>{" "}
                  {formatearHora(h.horaInicio)} - {formatearHora(h.horaFin)}
                </p>
             </div>
             <button onClick={()=>{
              EliminarSesion({
                curso,
                tipo,
                grupo,
                nombre,
                aula: h.aula,
                dia: h.dia,
                horaInicio: h.horaInicio,
                horaFin: h.horaFin
              })
              setCambio(true)
             }}>Eliminar</button>
            </div>
          ))}
        </div>
      ) : (
        <p>—</p>
      )}
    </div>
  );
};

type ListaFechasProps = {
  fechas: Excepcion[];
};

export const ListaFechas = ({ fechas }: ListaFechasProps) => {
  return (
    <div className="lista">
      <div className="titulo-row">
        <h4>Fechas</h4>
        <button 
          className="row-button" 
          >Añadir</button>
      </div>
      {fechas?.length ? (
        <div>
           
          {fechas.map((f, i) => (
            <div className="horario-card" key={i}>
              <div className="horario-info">
                <p><strong>Fecha:</strong> {f.fecha}</p>
                <p><strong>Aula:</strong> {f.aula}</p>
                <p>
                  <strong>Duración:</strong>{" "}
                  {formatearHora(f.horaInicio)} - {formatearHora(f.horaFin)}
                </p>
              </div>

              <button className="row-button eliminar-btn">
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