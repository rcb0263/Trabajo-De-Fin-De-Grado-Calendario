'use client'
import { CalendarioDia } from "@/componentes/CalendarioDia";
import { HorarioSemana } from "@/componentes/HorarioSemana";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const [token, setToken] = useState<string>('')
  const [error, setError]= useState<boolean>(false);
  const [modo, setModo]= useState<string>('semana');
  
  const router = useRouter()
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);
  return (
    <div>
      <h1>Sesion Profesor</h1>
      <button onClick={()=>{
        setModo('dia')
      }}>DIA</button>
      <button onClick={()=>{
        setModo('semana')
      }}>SEMANA</button>
      <button onClick={()=>{
        setModo('mes')
      }}>MES</button>
      {modo==='semana' &&<HorarioSemana mail={"redefrdes@nebrija.es"}/>}
      {modo==='dia' &&<CalendarioDia mail={"redefrdes@nebrija.es"}/>}
    </div>
  );
}

export default Page;