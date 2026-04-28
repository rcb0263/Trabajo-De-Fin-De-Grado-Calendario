'use client'


import { useEffect, useState } from "react";
import { Excepcion, GrupoAsignatura, GrupoPrivilegioTipo, Hora, Sesion } from "@/types";
import { GetGrupoPrivilegios } from "@/lib/spi/privilegios";
import { useRouter } from "next/navigation";
import "./style.css"
import { ListaPrivilegios } from "@/componentes/ListaPrivilegiosNombres";
import { AñadirAlumno, DeleteAlumno } from "@/lib/spi/alumnos";
import { AñadirProfesor, DeleteProfesor, QuitarProfesor } from "@/lib/spi/profesor";
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
  }, [grupoData]);

  return (
    <div className="grupo-detalle">
      <p>cambio: {cambio}</p>
      <h2>{nombre}</h2>
      <h3>{grupoData.tipo} Grupo {grupoData.grupo}</h3>
      <div className="seccion-grupos">
        <ListaUsuarios usuarios={grupoData.profesores} curso={curso} nombre={nombre} tipo={tipo} grupo={grupo} tipoUsuario="Profesores" setCambio={setCambio}/>
        <ListaUsuarios usuarios={grupoData.alumnos}  curso={curso} nombre={nombre} tipo={tipo} grupo={grupo} tipoUsuario="Alumnos" setCambio={setCambio}/>

        <ListaPrivilegios privilegios={gruposPrivilegiados} urlBase={urlBase}/>
        <div>
          {grupoData.horarios?.length>0 &&
            <ListaHorarios horarios={grupoData.horarios}/>
          }
        </div>
        <div>
          {grupoData.fechas?.length>0&&
            <ListaFechas fechas={grupoData.fechas}/>
          }
        </div>

      </div>
      

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
  horarios: Sesion[];
};
const formatearHora = (h:Hora) =>{

  return (h.hora+':'+h.minuto)
};
const ListaHorarios = ({ horarios }: ListaHorariosProps) => {


  return (
    <div className="lista">
     <div className="titulo-row">
        <h4>Horarios</h4>
        <button 
          className="row-button" 
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
             <button>Eliminar</button>
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
    <div>
      <strong>Fechas:</strong>

      {fechas?.length ? (
        <div className="lista">
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