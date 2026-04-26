import { darPrivilegios } from "@/lib/spi/privilegios";
import { useState } from "react"


export const DarPrivilegios = () =>{
  
  const fecha = new Date().toISOString().split("T")[0];
  const [mail, setMail] = useState<string>('')
  const [nombreGrupo, setGrupo] = useState<string>('')
  const [tipoUsuario, setTipoUsuario] = useState<string>('')
  const [fechaFin, setFechaFin] = useState<string>(fecha)
  const [error, setError]= useState<string>('');

  return(
      <div className="contenedor">
      <p >Usuario: </p>
      <input className={error.includes('usuario')? 'input-error':''}
        name="mail"
        value={mail}
        onChange={e=>{
          setMail(e.target.value)
          setError(error.replaceAll('usuario', ''))
        }}
        placeholder="nombre"/>
      
      <p >Grupo: </p>
      <input className={error.includes('nombreGrupo')? 'input-error':''}
        name="grupo"
        value={nombreGrupo}
        onChange={e=>{
          setGrupo(e.target.value)
          setError(error.replaceAll('nombreGrupo', ''))
        }}
        placeholder="grupo"/>
      

      <p>Fech Fin: </p>
      <input className={error.includes('fech')? 'input-error':''}
        type="date"
        name="fecha"
        value={fechaFin}
        onChange={(e) => {

          setFechaFin(e.target.value)
          setError(error.replaceAll('nombreGrupo', ''))
        }}
      />

      <p>Tipo de Usuario: </p>
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


      <button className="boton" onClick={async () => {
          try {
            await darPrivilegios({
                mail,
                nombreGrupo,
                tipoUsuario,
                fechaFin
            })
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