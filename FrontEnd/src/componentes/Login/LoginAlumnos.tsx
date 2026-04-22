import { loginAlumno } from "@/lib/spi/login";
import { useEffect, useState } from "react";
import "./style.css"
import { useRouter } from "next/navigation";


const LoginAlumnos = ()  =>{
  const [token, setToken] = useState<string>('')

  const [mail, setMail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError]= useState<boolean>(false);
  const router = useRouter()

  useEffect(()=>{
    if(token!=''){
      router.push(`/Alumno`)
    }
  },[token])
    return(
        <div className="contenedorLogin">
        <input 
          value={mail}
          onChange={e=>setMail(e.target.value)}
          placeholder="Mail"/>
        <input 
          value={password}
          onChange={e=>setPassword(e.target.value)}
          placeholder="Contraseña"/>
        {error&&token=='' && <p>datos incorrectos</p>}
        <button onClick={async ()=>{
            try {
            const token = await loginAlumno(mail, password);
            setToken(token);
            localStorage.setItem("token", token);
            setError(false);
            if(token!=''){
              router.push(`/Alumnos`)
            }
            } catch (err) {
            setError(true);
            }
        }}>Iniciar Sesion Como Alumno</button>
        </div>
    )
}

export default LoginAlumnos