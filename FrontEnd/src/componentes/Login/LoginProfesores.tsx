import { loginProfesor } from "@/lib/spi/login";
import { useState } from "react";
import "./style.css"

type Params = {
    setToken: React.Dispatch<React.SetStateAction<string>>
    token: string
}
const LoginProfesores = ({setToken, token}: Params) =>{
  const [mail, setMail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError]= useState<boolean>(false);

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
            const token = await loginProfesor(mail, password);
            setToken(token);
            localStorage.setItem("token", token);
            setError(false);
            } catch (err) {
            setError(true);
            }
        }}>Iniciar Sesion Como Profesor</button>
        </div>
    )
}

export default LoginProfesores