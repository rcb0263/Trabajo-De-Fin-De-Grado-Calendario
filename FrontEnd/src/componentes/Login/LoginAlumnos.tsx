import { loginAlumno } from "@/lib/spi/login";
import { useEffect, useState } from "react";
import "./style.css"
import { useRouter } from "next/navigation";

type Params = {
    setToken: React.Dispatch<React.SetStateAction<string>>
    token: string
}
const LoginAlumnos = ({setToken, token}: Params)  =>{
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
        <div className="contenedor">
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
            } catch (err) {
            setError(true);
            }
        }}>Iniciar Sesion Como Alumno</button>
        </div>
    )
}

export default LoginAlumnos