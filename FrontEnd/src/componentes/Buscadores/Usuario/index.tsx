import { SearchAsignaturas } from "@/lib/spi/asignaturas";
import { Asignatura, Usuario } from "@/types";
import { useState } from "react";
import { AsignaturaBox } from "@/componentes/AsignaturaBox";
import { BuscarAlumno } from "@/lib/spi/alumnos";
import { UsuarioBox } from "./UsuarioBox";
import { BuscarProfesor } from "@/lib/spi/profesor";

export const BuscadorUsuarios = () => {

  const [mail, setMail] = useState<string>('')
  const [tipoUsuario, setTipoUsuario] = useState<string>('')
  const [result, setResult] = useState<Usuario[]|null>(null)

  return (
    <div className="SearchConenedor contenedor" style={{ width: '70%' }}>
      <h1>Buscar Usuarios</h1>
      <div className="searchParams" >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p>Mail</p>
          <input
            name="mail"
            value={mail}
            onChange={e=>{
              setMail(e.target.value)
            }}
            placeholder="mail"/>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
            <p>Tipo de usuario: </p>
            <select
            name="tipo"
            value={tipoUsuario}
            onChange={e => {
                setTipoUsuario(e.target.value)
            }}
            >
            <option value="">Selecciona tipo de Usuario</option>
            <option value="Profesor">Profesor</option>
            <option value="Alumno">Alumno</option>
            </select>
        </div>
        <button className="boton" disabled={tipoUsuario==''} onClick={async () => {
            try {
                if(tipoUsuario=='Alumno'){
                    const respuesta = await BuscarAlumno({
                        mail,
                        tipoUsuario
                    });
                    setResult(respuesta)
                }else{
                    const respuesta = await BuscarProfesor({
                        mail,
                        tipoUsuario
                    });
                    setResult(respuesta)
                }
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
        <UsuarioBox
          key={e._id}
          id={e._id}
          nombre={e.nombre}
          mail={e.mail}
          tipoUsuario={tipoUsuario}
          asignaturas={e.asignaturas}
    />)}
      </div>
    </div>
  );
}
