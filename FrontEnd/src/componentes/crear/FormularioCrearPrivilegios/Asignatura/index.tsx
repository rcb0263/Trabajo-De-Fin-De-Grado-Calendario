import { crearPrivilegiosAsignatura } from "@/lib/spi/privilegios"
import { useState } from "react"


type Props = {
  data?: {
    nombreAsignatura: string
    curso: number;
    setCambio: React.Dispatch<React.SetStateAction<boolean>>;
  }
};
export const PrivilegiosAsignatura = ({data}: Props) =>{
  const añoActual = new Date().getFullYear();

  const [nombre, setNombre] = useState<string>('')
  const [nombreAsignatura, setNombreAsignatura] = useState<string>(data?.nombreAsignatura||'')
  const [curso, setCurso] = useState<number>(data?.curso||añoActual)
  const [basicos, setBasico] = useState<boolean>(false)
  const [avanzados, setAvanzado] = useState<boolean>(false)

  const [error, setError]= useState<string>('');

  return(
      <div className="contenedor">
      <p >Nombre: </p>
      <input className={error.includes('nombre')? 'input-error':''}
        name="nombre"
        value={nombre}
        onChange={e=>{
          setNombre(e.target.value)
          setError(error.replaceAll('nombre', ''))
        }}
        placeholder="nombre"/>
      <p >Asignatura: </p>
      <input className={error.includes('nombreAsignatura')? 'input-error':''}
        name="nombreAsignatura"
        value={nombreAsignatura}
        onChange={e=>{
          setNombreAsignatura(e.target.value)
          setError(error.replaceAll('nombreAsignatura', ''))
        }}
        placeholder="Asignatura"/>
      

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

      <p className={error.includes('tipo')? 'error-text':''}>Tipo de usuario: </p>
      
      <label className="cajita">
          <input 
            type="checkbox"     
            checked={basicos}
            onChange={(e) => {
              setBasico(e.target.checked)
            }}/>
            <span>Permisos Basicos</span>
      </label>
      <label className="cajita">
          <input 
            type="checkbox"     
            checked={avanzados}
            onChange={(e) => setAvanzado(e.target.checked)}/>
            <span>Permisos Avanzados</span>
      </label>

      <button className="boton" disabled={!basicos&&!avanzados} onClick={async () => {
          try {
            await crearPrivilegiosAsignatura({
              nombre, nombreAsignatura, curso, basicos, avanzados
            });
            setError('')
            alert("OK");
            data?.setCambio(true)
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
  )
}