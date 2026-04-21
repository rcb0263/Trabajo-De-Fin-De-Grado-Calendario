'use client'
import {  crearGrupoAsignatura } from "@/lib/spi/asignaturas";
import { useEffect, useState } from "react";
import '../formularioStyle.css'
import { crearPrivilegiosUsuario } from "@/lib/spi/privilegios";
import { PrivilegiosUsuario } from "@/componentes/FormularioCrearPrivilegios/Usuario";
import { PrivilegiosAula } from "@/componentes/FormularioCrearPrivilegios/Aula";
import { PrivilegiosAsignatura } from "@/componentes/FormularioCrearPrivilegios/Asignatura";
import { PrivilegiosGrupoAsignatura } from "@/componentes/FormularioCrearPrivilegios/GrupoAsignatura";
const Page = () => {
  
  const [nombreTipoDeGrupo, setNombreTipoDeGrupo] = useState<string>('Usuario')

  const token = localStorage.getItem("token");
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWU3NTc0NTRkZWQ4ZDIxZTYwZDA4YWMiLCJtYWlsIjoiY2FsbmVAbWFpbC5jb20iLCJ0aXBvIjoiQWRtaW5pc3RyYWRvciIsImlhdCI6MTc3NjgwMjQ5NywiZXhwIjoxNzc2ODA2MDk3fQ.0Azjo9s82pOhxjqijI1Ghm2uR8CePMJC1vEov7vqzGg
//
  useEffect(() => {
  }, []);
  return (
    <>  
        <p>Token: {"\n"+token} </p>
        <p >Tipo de Grupo: </p>
        <select 
          name="privilegio"
          value={nombreTipoDeGrupo}
          onChange={e => {
            setNombreTipoDeGrupo(e.target.value)
          }}
        >
          <option value="Usuario">Usuario</option>
          <option value="Asignatura">Asignatura</option>
          <option value="Aula">Aula</option>
          <option value="Grupo">Grupo</option>
        </select>
        <h1>Creación de privilegios de {nombreTipoDeGrupo}</h1>
      {nombreTipoDeGrupo=='Usuario' &&<PrivilegiosUsuario/>}
      {nombreTipoDeGrupo=='Asignatura' &&<PrivilegiosAsignatura/>}
      {nombreTipoDeGrupo=='Aula' &&<PrivilegiosAula/>}
      {nombreTipoDeGrupo=='Grupo' &&<PrivilegiosGrupoAsignatura/>}
    </>
  );
}

export default Page;