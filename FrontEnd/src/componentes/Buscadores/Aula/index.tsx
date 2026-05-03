
import { Aula } from "@/types";
import { useState } from "react";
import { SearchAulas } from "@/lib/spi/aula";

export const BuscadorAulas = () => {

  const [nombre, setNombre] = useState<string>('')
  const [result, setResult] = useState<Aula[]|null>(null)

  return (
    <div className="SearchConenedor contenedor" style={{ width: '70%' }}>
      <h1>Buscar Usuarios</h1>
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
            alert("OK");
            
          } catch (err: any) {
            const mensaje = err.response?.data?.mensaje;

            if (Array.isArray(mensaje)) {
              alert(mensaje.join("\n"));
            } else {
              alert(mensaje || "Error desconocido");
            }
          }
        }}>Buscar</button>
      </div>
      <div className="listas">
        {result && result.length!==0 && result.map(e=>
        <p key={e._id}>{e._id}</p>
    )}
      </div>
    </div>
  );
}
