'use client'
import { loginAdmin } from "@/lib/spi/login";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const [mail, setMail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [token, setToken] = useState<string>('')
  const [error, setError]= useState<boolean>(false);
  const router = useRouter()

  useEffect(()=>{
    if(token!=''){
      
      //router.push(`/portalProfesor`)
    }
  },[token])
  return (
    <div>
      <h1>Inicio de sesion Alumnos</h1>
      <input 
          value={mail}
          onChange={e=>setMail(e.target.value)}
          placeholder="Mail"/>
      <input 
          value={password}
          onChange={e=>setPassword(e.target.value)}
          placeholder="Contraseña"/>
      {error&&token=='' && <p>datos incorrectos</p>}
      {token!== '' && <p>{token}</p>}
      <button onClick={async ()=>{
        try {
          const token = await loginAdmin(mail, password);
          setToken(token);
          setError(false);
        } catch (err) {
          setError(true);
        }
      }}>Iniciar Sesion</button>
    </div>
  );
}

export default Page;