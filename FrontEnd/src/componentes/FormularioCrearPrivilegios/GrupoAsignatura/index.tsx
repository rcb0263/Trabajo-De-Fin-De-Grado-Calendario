import { crearPrivilegiosAsignatura, crearPrivilegiosAula, crearPrivilegiosGrupoAsignatura } from "@/lib/spi/privilegios"
import { useState } from "react"


export const PrivilegiosGrupoAsignatura = () =>{
  const añoActual = new Date().getFullYear();

  const [nombre, setNombre] = useState<string>('')
  const [grupo, setGrupo] = useState<string>('')
  const [tipo, setTipo] = useState<string>('')
  const [nombreAsignatura, setNombreAsignatura] = useState<string>('')
  const [curso, setCurso] = useState<number>(añoActual)
  const [basicos, setBasico] = useState<boolean>(false)
  const [avanzados, setAvanzado] = useState<boolean>(false)
  const [profesores, setProfesores] = useState<boolean>(false)
/*

    tipo:string,
*/
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
      
      <p >Grupo: </p>
      <input className={error.includes('grupo')? 'input-error':''}
        name="grupo"
        value={grupo}
        onChange={e=>{
          setGrupo(e.target.value)
          setError(error.replaceAll('grupo', ''))
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

      <p>Tipo de Grupo: </p>
      <select className={error.includes('tipoUsuario')? 'input-error':''}
          name="tipo"
          value={tipo}
          onChange={e => {
            setTipo(e.target.value)
            setError(error.replaceAll('tipo', ''))
          }}
        >
          <option value="">Selecciona tipo de Usuario</option>
          <option value="Teoria">Teoria</option>
          <option value="Practica">Practica</option>
        </select>

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
      <label className="cajita">
          <input 
            type="checkbox"     
            checked={profesores}
            onChange={(e) => setProfesores(e.target.checked)}/>
            <span>Permisos de Profesor</span>
      </label>

      <button className="boton" disabled={!basicos&&!avanzados&&!profesores} onClick={async () => {
          try {
            await crearPrivilegiosGrupoAsignatura({
              nombre, nombreAsignatura, curso, grupo, tipo, basicos, avanzados, profesores
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
  )
}