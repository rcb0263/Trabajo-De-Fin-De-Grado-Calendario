'use client'
import { CalendarioDia } from "@/componentes/CalendarioDia";
import { HorarioSemana } from "@/componentes/HorarioSemana";
import "./style.css"
import { useEffect, useState } from "react";
import { GrupoAsignaturacomp, Usuario } from "@/types";
import { GetUsuario, userFromToken } from "@/lib/spi/usuarios";
import { UsuarioDetalleCard } from "@/componentes/Buscadores/Usuario/UsuarioBox/UsuarioInfo";
import { GrupoDetalleUsuarios } from "@/componentes/Buscadores/Asignatura/AsignaturaBox/AsignaturaInfo/GrupoAsignatura/VistaUsuarios";
import { GetGrupoAsignaturaSinTipo } from "@/lib/spi/asignaturas";

const Page = () => {
  const tipo = 'Profesor';
  const [modo, setModo]= useState<string>('semana');
  const [nombre, setNombre]= useState<string>('');
  const [mail, setMail]= useState<string|null>(null);
  const [id, setId]= useState<string|null>(null);
  const [grupo, setGrupo]= useState<GrupoAsignaturacomp|null>(null);
  const [derecha, setDerecha] = useState<string>('calendario')
  const [cambio, setCambio]= useState<boolean>(false)

useEffect(() => {
  const fetchNombre = async () => {
    const data:Usuario = await GetUsuario({tipo:'Profesor', mail: mail!});
    setNombre(data.nombre);
    setId(String(data._id));
  };
  const setmail = async () =>{
    const res = await userFromToken({tipo: 'Profesor'})

    setMail(res.mail)
  }
  const fetchFechas = async () => {
    if(grupo){  
    const data= await  GetGrupoAsignaturaSinTipo({
        curso: grupo!.curso,
        nombre: grupo!.nombre,
        grupo: grupo!.grupo
      })
      setGrupo({
        ...grupo,
        fechas: data!.fechas
      })
    }

  };
  setmail()
  if (mail) {
    fetchNombre();
  }
  if(grupo && cambio==true){
    fetchFechas()
  }
  console.log({datos: grupo?.fechas,
    mensaje:'cambio: '+(cambio==true?'1':'0')})
  setCambio(false)
}, [mail,cambio]);

  return (
    <div className="paginaUsuario">
      <h1>Usuario {nombre}</h1>
      <div className="row">
        <div className="izquierda">
          {id && 
          <UsuarioDetalleCard
            notAdmin="user" 
            id={id} tipo={"Profesor"}
            data={{
                setDerecha: setDerecha,
                setGrupo: setGrupo,
                usuario: 'Profesor',
                derecha: derecha
              }}
            />}
        </div>
        <div className="derecha">

        {derecha=='calendario' &&
          <div>
          <button onClick={()=>{
            setModo('dia')
          }}>DIA</button>
          <button onClick={()=>{
            setModo('semana')
          }}>SEMANA</button>
          <button onClick={()=>{
            setModo('mes')
          }}>MES</button>
          {modo==='semana' && mail &&<HorarioSemana mail={mail}/>}
          {modo==='dia' && mail &&<CalendarioDia mail={mail}/>}
          </div>}
        {grupo && derecha=='detallesGrupo' && 
          <div>
            <button onClick={()=>{
              setDerecha('calendario')
            }}>Horarios</button>
            
            <GrupoDetalleUsuarios 
            grupoData={grupo} 
            curso={grupo.curso} 
            nombre={grupo.nombre} 
            grupo={grupo.grupo} 
            tipo={grupo.tipo} 
            setCambio={setCambio} 
            cambio={cambio} 
            usuario={"Profesor"}/>
          </div>          
        }
        </div>
      </div>
    </div>
  );
}

export default Page;