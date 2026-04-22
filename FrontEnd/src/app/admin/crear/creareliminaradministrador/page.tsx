'use client'
import { useEffect, useState } from "react";
import { AñadirAdmin, CrearAdmin, EliminarAdmin } from "@/lib/spi/administradores";
import "./style.css"
const Page = () => {

  const [nombre, setNombre] = useState<string>('')
  const [mail, setMail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [add, setAdd] = useState<boolean>(true)
  const [mail2, setMail2] = useState<string>('')

  const [error, setError]= useState<string>('');

  
  return (
    <>
      <h1>Crear Admin</h1>
      <div className="multiContenedores">
        <div className="contenedor">        
          <p >Nombre: </p>
          <input className={error.includes('nombre')? 'input-error':''}
            name="nombre"
            value={nombre}
            onChange={e=>setNombre(e.target.value)}
            placeholder="nombre"/>

          <p >mail: </p>
          <input className={error.includes('mail')? 'input-error':''}
            name="mail"
            value={mail}
            onChange={e=>setMail(e.target.value)}
            placeholder="mail"/>
            
          <p >Contraseña: </p>
          <input className={error.includes('password')? 'input-error':''}
            name="password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            placeholder="password"/>

          <label className="cajita">
            <input 
              type="checkbox"     
              checked={add}
              onChange={(e) => setAdd(e.target.checked)}/>
            
            <span>Añadir a grupo de Administradores</span>
          </label>        
          <button className="boton" onClick={async () => {
              try {            
                await CrearAdmin({ nombre, mail, password });
                await AñadirAdmin({mail})
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
        </div >
        <div className="contenedorAdminPrincipal">
          <div className="contenedor">        
            <p >mail: </p>
            <input className={error.includes('nombre')? 'input-error':''}
              name="mail"
              value={mail2}
              onChange={e=>setMail2(e.target.value)}
              placeholder="mail"/>
          
            <button className="boton" onClick={async () => {
                try {            
                  await EliminarAdmin({mail: mail2})
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
            }}>Añadir</button>
          </div>
          <div className="contenedor">        

            <p >mail: </p>
            <input className={error.includes('nombre')? 'input-error':''}
              name="mail"
              value={mail2}
              onChange={e=>setMail2(e.target.value)}
              placeholder="mail"/>
          
            <button className="boton" onClick={async () => {
                try {            
                  await AñadirAdmin({mail: mail2})
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
            }}>Eliminar</button>
          </div>
        </div>

      </div>
    </>
  );
}

export default Page;