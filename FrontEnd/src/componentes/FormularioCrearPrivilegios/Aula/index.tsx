import { crearPrivilegiosAula } from "@/lib/spi/privilegios"
import { useState } from "react"


export const PrivilegiosAula = () =>{

    const [nombre, setNombre] = useState<string>('')
    const [aula, setAula] = useState<string>('')
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
        
        <p >Mail: </p>
        <input className={error.includes('mail')? 'input-error':''}
          name="aula"
          value={aula}
          onChange={e=>{
            setAula(e.target.value)
            setError(error.replaceAll('aula', ''))
          }}
          placeholder="aula"/>

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
              await crearPrivilegiosAula({
                nombre, aula, basicos, avanzados, 
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