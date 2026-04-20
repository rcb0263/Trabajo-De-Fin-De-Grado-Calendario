'use client'
import { crearAsignatura, crearGrupoAsignatura } from "@/lib/spi/asignaturas";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import './stylres.css'
const Page = () => {
  const cursoActual = new Date().getFullYear();
  const [nombre, setNombre] = useState<string>('')
  const [curso, setCurso] = useState<number>(cursoActual)
  const [tipo, setTipo] = useState<string>('')
  const [grupo, setGrupo] = useState<string>('')

  const [error, setError]= useState<string>('');

  useEffect(() => {
  }, []);
  return (
    <>
      <h1>Crear Grupo Asignatura</h1>
      <div className="contenedor">
        <p className={error.includes('asignatura')? 'error-text':''}>Nombre: </p>
        <input className={error.includes('asignatura')? 'input-error':''}
          name="nombre"
          value={nombre}
          onChange={e=>{
            setNombre(e.target.value)
            setError(error.replaceAll('asignatura', ''))
          }}
          placeholder="nombre"/>

        <p className={error.includes('curso')? 'error-text':''}>Curso: </p>
        <input className={error.includes('curso')? 'input-error':''}
          name="curso"
          type="number"
          min={cursoActual}
          value={curso}
          onChange={e => {
            setCurso(Number(e.target.value))
            setError(error.replaceAll('curso', ''))
          }}
        />
        <p className={error.includes('tipo')? 'error-text':''}>Tipo: </p>
        <select className={error.includes('tipo')? 'input-error':''}
          name="tipo"
          value={tipo}
          onChange={e => {
            setTipo(e.target.value)
            setError(error.replaceAll('tipo', ''))
          }}
        >
          <option value="">Selecciona de grupo</option>
          <option value="Teoria">Teoria</option>
          <option value="Practica">Practica</option>
        </select>
        <p className={error.includes('grupo')? 'error-text':''}>grupo: </p>
        <input className={error.includes('grupo')? 'input-error':''}
          name="grupo"
          value={grupo}
          onChange={e=>setGrupo(e.target.value)}
        />

        <button className="boton" disabled={curso<cursoActual} onClick={async () => {
            try {
              await crearGrupoAsignatura({
                nombre, curso, grupo, tipo, horario: []
              });
              setError('')
              alert("OK");

            } catch (err: any) {
              const mensaje = err.response?.data?.message;

              if (Array.isArray(mensaje)) {
                alert(mensaje.join("\n"));
                setError(mensaje.join("\n"))
              } else {
                alert(mensaje || "Error desconocido");
              }
            }
        }}>Crear</button>

      </div>
    </>
  );
}

export default Page;