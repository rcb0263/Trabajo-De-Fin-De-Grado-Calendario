'use client'
import {  crearGrupoAsignatura } from "@/lib/spi/asignaturas";
import { useEffect, useState } from "react";




type Props = {
  data?: {
    nombre: string,
    curso: number,
    tipo: string
    setDerecha: React.Dispatch<React.SetStateAction<string>>;
    setCambio: React.Dispatch<React.SetStateAction<boolean>>;
  }
};
export const CrearGrupoAsignatura = ({data}:Props) =>{
  const cursoActual = new Date().getFullYear();
  
  const [nombre, setNombre] = useState<string>(data?.nombre||'')
  const [curso, setCurso] = useState<number>(data?.curso||cursoActual)
  const [tipo, setTipo] = useState<string>(data?.tipo||'')
  const [grupo, setGrupo] = useState<string>('')

  const [error, setError]= useState<string>('');


  
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
              data?.setCambio(true)
            } catch (err: any) {
              const mensaje = err.response?.data?.message;

              if (Array.isArray(mensaje)) {
                setError(mensaje.join("\n"))
              } 
            }
        }}>Crear</button>

      </div>
    </>
  );
}

export default CrearGrupoAsignatura;