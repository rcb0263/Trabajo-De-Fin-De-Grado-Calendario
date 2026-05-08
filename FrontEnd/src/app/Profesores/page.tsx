'use client'
import { CalendarioDia } from "@/componentes/CalendarioDia";
import { HorarioSemana } from "@/componentes/HorarioSemana";
import "./style.css"
import { useEffect, useState } from "react";
import { Usuario } from "@/types";
import { GetUsuario, userFromToken } from "@/lib/spi/usuarios";
import { UsuarioDetalleCard } from "@/componentes/Buscadores/Usuario/UsuarioBox/UsuarioInfo";

const Page = () => {
  const tipo = 'Profesor';
  const [modo, setModo]= useState<string>('semana');
  const [nombre, setNombre]= useState<string>('');
  const [mail, setMail]= useState<string|null>(null);
  const [id, setId]= useState<string|null>(null);
  
useEffect(() => {
  const fetchNombre = async () => {
    const data:Usuario = await GetUsuario({tipo:'Profesor', mail: mail!});
    console.log(data)
    setNombre(data.nombre);
    setId(String(data._id));
    console.log(data)
  };
  const setmail = async () =>{
    const res = await userFromToken({tipo: 'Profesor'})

    setMail(res.mail)
  }
  setmail()
  if (mail) {
    fetchNombre();
  }
}, [mail]);

  return (
    <div className="paginaUsuario">
      <h1>Usuario {nombre}</h1>
      <button onClick={()=>{
        setModo('dia')
      }}>DIA</button>
      <button onClick={()=>{
        setModo('semana')
      }}>SEMANA</button>
      <button onClick={()=>{
        setModo('mes')
      }}>MES</button>
      <div className="row">
          <div>
          {modo==='semana' && mail &&<HorarioSemana mail={mail}/>}
          {modo==='dia' && mail &&<CalendarioDia mail={mail}/>}
          </div>
          <div>
          {id && <UsuarioDetalleCard notAdmin="user" id={id} tipo={"Profesor"}/>}
          </div>
        
      </div>
    </div>
  );
}

export default Page;