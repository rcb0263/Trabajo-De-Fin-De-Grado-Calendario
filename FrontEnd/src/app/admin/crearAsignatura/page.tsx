'use client'
import { crearAsignatura } from "@/lib/spi/asignaturas";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import './stylres.css'
const Page = () => {
  const añoActual = new Date().getFullYear();

  const [resultado, setResultado] = useState<string>('')
  const [nombre, setNombre] = useState<string>('')
  const [curso, setCurso] = useState<number>(añoActual)
  const [año, setAño] = useState<number>(1)
  const [grado, setGrado] = useState<string>('')
  const [semestre, setSemestre] = useState<string>('')

  const [error, setError]= useState<string>('');

  const router = useRouter()

  useEffect(() => {
  }, []);
  return (
    <>
      <h1>Crear Asignatura</h1>
      <div className="contenedor">
        <p className={error.includes('nombre')? 'error-text':''}>Nombre: </p>
        <input className={error.includes('nombre')? 'input-error':''}
          name="nombre"
          value={nombre}
          onChange={e=>setNombre(e.target.value)}
          placeholder="nombre"/>

        <p className={curso<añoActual? 'error-text':''}>Curso: </p>
        <input className={curso<añoActual? 'input-error':''}
          name="curso"
          type="number"
          min={añoActual}
          value={curso}
          onChange={(e) => {
            setCurso(Number(e.target.value))
          }}
        />
        <p className={error.includes('semestre')? 'error-text':''}>Semestre: </p>
        <select className={error.includes('semestre')? 'input-error':''}
          name="semestre"
          value={semestre}
          onChange={e => setSemestre(e.target.value)}
        >
          <option value="">Selecciona semestre</option>
          <option value="Primero">Primero</option>
          <option value="Segundo">Segundo</option>
        </select>
        <p className={error.includes('año')? 'error-text':''}>Año: </p>
        <input className={error.includes('año')? 'input-error':''}
          name="año"
          type="number"
          min={1}
          max={6}
          value={año}
          onChange={e=>setAño(Number(e.target.value))}
        />

        <p  className={error.includes('grado')? 'error-text':''}>Grado: </p>
        <input className={error.includes('grado')? 'input-error':''}
          name="grado"
          value={grado}
          onChange={e=>setGrado(e.target.value)}
          placeholder="grado"/>

        <button className="boton" disabled={curso<añoActual} onClick={async () => {
            try {

            
              await crearAsignatura({ nombre, curso, año, grado, semestre });

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
        {resultado!=''&& <p>{resultado}</p>}
      </div>
    </>
  );
}

export default Page;