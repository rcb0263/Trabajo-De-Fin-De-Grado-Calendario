'use client'
import { useEffect, useState } from "react";
import { DarPrivilegios } from "@/componentes/modificarPrivilegios/darPrivilegios";
import { QuitarPrivilegios } from "@/componentes/modificarPrivilegios/quitarPrivilegios";
const Page = () => {
  
  const [nombreTipoDeGrupo, setNombreTipoDeGrupo] = useState<string>('Añadir')

  
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
          <option value="Añadir">Añadir Usuario</option>
          <option value="Eliminar">Eliminar Usuario</option>
        </select>
        <h1>{nombreTipoDeGrupo} Usuario de Privilegios</h1>
      {nombreTipoDeGrupo=='Añadir' &&<DarPrivilegios/>}
      {nombreTipoDeGrupo=='Eliminar' &&<QuitarPrivilegios/>}
    </>
  );
}

export default Page;