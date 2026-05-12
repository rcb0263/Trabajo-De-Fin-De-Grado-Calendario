
import { Aula } from "@/types";
import { useState } from "react";
import { SearchAulas } from "@/lib/spi/aula";
import { useRouter } from "next/navigation";
import { AulaBox } from "./AulaBox";

export const BuscadorAulas = () => {

  const [nombre, setNombre] = useState<string>('')
  const [result, setResult] = useState<Aula[]|null>(null)
    const router = useRouter()

  return (
    <div className="SearchConenedor contenedor" style={{ width: '70%' }}>
      <h1>Buscar Aulas</h1>
      <div className="searchParams" >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p>Aula</p>
          <input
            name="nombre"
            value={nombre}
            onChange={e=>{
              setNombre(e.target.value)
            }}
            placeholder="nombre"/>
        </div>
        <button className="boton" disabled={nombre.length==0} onClick={async () => {
          try {
            const respuesta = await SearchAulas({nombre});
            setResult(respuesta)
            
          } catch (err: any) {

          }
        }}>Buscar</button>
      </div>
      <div className="listas">
        {result && result.length!==0 && result.map(e=>
        <AulaBox
          key={e._id}
          id={e._id}
          aula={e.aula}
        />)}
      </div>
    </div>
  );
}
