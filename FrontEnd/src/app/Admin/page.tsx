'use client'
import { SearchAsignaturas } from "@/lib/spi/asignaturas";
import { Asignatura } from "@/types";
import { useState } from "react";
import "./formularioStyle.css"
const Page = () => {
  const cursoActual = new Date().getFullYear();

  const [nombre, setNombre] = useState<string>('')
  const [curso, setCurso] = useState<number>(cursoActual)
  const [grado, setGrado] = useState<string>('')
  const [result, setResult] = useState<Asignatura[]>([])
  return (
    <div>
      <h1>Crear Grupo Asignatura</h1>
      <div className="searchParams" >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p>Nombre</p>
          <input
            name="nombre"
            value={nombre}
            onChange={e=>{
              setNombre(e.target.value)
            }}
            placeholder="nombre"/>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p>Grado </p>
          <input
            name="grado"
            value={grado}
            onChange={e=>{
              setGrado(e.target.value)
            }}
            placeholder="grado"/>
          </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p >Curso</p>
          <input
            name="curso"
            type="number"
            min={cursoActual}
            value={curso}
            onChange={e => {
              setCurso(Number(e.target.value))
            }}
          />
        </div>
        <button className="boton" onClick={async () => {
            try {
              const respuesta = await SearchAsignaturas({
                nombre, curso, grado
              });
              console.log(respuesta)
              setResult(respuesta)
              alert("OK");
              
            } catch (err: any) {
              console.log(err)
              const mensaje = err.response?.data?.mensaje;

              if (Array.isArray(mensaje)) {
                alert(mensaje.join("\n"));
              } else {
                alert(mensaje || "Error desconocido");
              }
            }
        }}>Buscar</button>
      </div>
      <div>
        {result.length!==0 && result.map(e=>{
          return(
            <p key={e._id}>{e.nombre}</p>
          )
        })}
      </div>
    </div>
    
  );
}

export default Page;