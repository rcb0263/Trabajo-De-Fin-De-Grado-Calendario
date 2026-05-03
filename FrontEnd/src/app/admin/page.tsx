'use client'

import { useState } from "react";
import "./style.css"
import { BuscadorAsignaturas } from "@/componentes/Buscadores/Asignatura";
import { BuscadorUsuarios } from "@/componentes/Buscadores/Usuario";
import { BuscadorAulas } from "@/componentes/Buscadores/Aula";

const Page = () => {
  const [tipo, setTipo] = useState<string>('Asignatura')
  return (
    <div className="AsignaturaMainPage">
      <div className="menuSelector">
        <button
          onClick={() => setTipo('Asignatura')} 
          disabled={tipo === 'Asignatura'}
          className="botonSelector"
        >Asignaturas</button>
        <button
          onClick={() => setTipo('Usuario')}
          disabled={tipo === 'Usuario'}
          className="botonSelector"
        >Usuarios</button>

        <button
          onClick={() => setTipo('Aula')}
          disabled={tipo === 'Aula'}
          className="botonSelector"
        >Aulas</button>
      </div>

      {tipo=='Asignatura'&&<BuscadorAsignaturas/>}
      {tipo=='Usuario'&&<BuscadorUsuarios/>}
      {tipo=='Aula'&&<BuscadorAulas/>}
    </div>
  );
}

export default Page;