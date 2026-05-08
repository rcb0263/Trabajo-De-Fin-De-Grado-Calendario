'use client'

import { useEffect, useState } from "react";
import { PrivilegiosUsuario } from "@/componentes/crear/FormularioCrearPrivilegios/Usuario";
import { PrivilegiosAula } from "@/componentes/crear/FormularioCrearPrivilegios/Aula";
import { PrivilegiosAsignatura } from "@/componentes/crear/FormularioCrearPrivilegios/Asignatura";
import { PrivilegiosGrupoAsignatura } from "@/componentes/crear/FormularioCrearPrivilegios/GrupoAsignatura";
const Page = () => {
  
  const [nombreTipoDeGrupo, setNombreTipoDeGrupo] = useState<string>('Usuario')

  return (
    <>  
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