'use client'
import { useEffect, useState } from "react";

import { CrearAlumno } from "@/lib/spi/alumnos";
import { CrearProfesor } from "@/lib/spi/profesor";

const Page = () => {

  const [nombre, setNombre] = useState<string>('')
  const [mail, setMail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [tipo, setTipo] = useState<string>('')

  const [error, setError]= useState<string>('');

  return (
    <>
      <h1>Crear Asignatura</h1>
      <div className="contenedor">
        <p className={error.includes('tipo')? 'error-text':''}>Tipo de usuario: </p>
        <select className={error.includes('tipo')? 'input-error':''}
          name="tipo"
          value={tipo}
          onChange={e => setTipo(e.target.value)}
        >
          <option value="">Selecciona tipo de Usuario</option>
          <option value="Profesor">Profesor</option>
          <option value="Alumno">Alumno</option>
        </select>
        
        <p className={error.includes('nombre')? 'error-text':''}>Nombre: </p>
        <input className={error.includes('nombre')? 'input-error':''}
          name="nombre"
          value={nombre}
          onChange={e=>setNombre(e.target.value)}
          placeholder="nombre"/>

        <p  className={error.includes('mail')? 'error-text':''}>Correo: </p>
        <input className={error.includes('mail')? 'input-error':''}
          name="mail"
          value={mail}
          onChange={e=>setMail(e.target.value)}
          placeholder="mail"/>
        
        <p  className={error.includes('password')? 'error-text':''}>Contraseña: </p>
        <input className={error.includes('password')? 'input-error':''}
          name="password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          placeholder="password"/>
        
        <button disabled={tipo!=='Alumno' && tipo!=='Profesor'} className="boton" onClick={async () => {
            try {
              if(tipo == 'Alumno'){
                await CrearAlumno({
                  nombre,
                  mail,
                  password
                });
              }
              if(tipo == 'Profesor'){
                await CrearProfesor({
                  nombre,
                  mail,
                  password
                });
              }

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