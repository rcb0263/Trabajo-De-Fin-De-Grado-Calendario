import { crearPrivilegiosUsuario } from "@/lib/spi/privilegios"
import { useState } from "react"


export const PrivilegiosUsuario = () =>{

    const [nombre, setNombre] = useState<string>('')
    const [mail, setMail] = useState<string>('')
    const [tipoUsuario, setTipoUsuario] = useState<string>('')
    const [basicos, setBasico] = useState<boolean>(false)
    const [avanzados, setAvanzado] = useState<boolean>(false)
    const [asignaturas, setAsignatura] = useState<boolean>(false)

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
        
        <p >Mail: </p>
        <input className={error.includes('mail')? 'input-error':''}
          name="mail"
          value={mail}
          onChange={e=>{
            setMail(e.target.value)
            setError(error.replaceAll('mail', ''))
          }}
          placeholder="mail"/>

        <p className={error.includes('tipoUsuario')? 'error-text':''}>Tipo de usuario: </p>
        <select className={error.includes('tipoUsuario')? 'input-error':''}
          name="tipo"
          value={tipoUsuario}
          onChange={e => {
            setTipoUsuario(e.target.value)
            setError(error.replaceAll('tipo', ''))
          }}
        >
          <option value="">Selecciona tipo de Usuario</option>
          <option value="Profesor">Profesor</option>
          <option value="Alumno">Alumno</option>
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
              checked={asignaturas}
              onChange={(e) => setAsignatura(e.target.checked)}/>
              <span>Permisos Asignatura</span>
        </label>

        <button className="boton" disabled={!basicos&&!avanzados&&!asignaturas} onClick={async () => {
            try {
              await crearPrivilegiosUsuario({
                nombre, mail, tipoUsuario, basicos, avanzados, asignaturas
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