import { Sesion } from "@/types";
import { horarioProfesor } from "@/lib/spi/horarios";
import { useEffect, useState } from "react";
import './styles.css'
import { getDiaSemana, getFechaNumerica } from "@/componentes/funcionesComponentes";
import { DiaBox } from "./DiaColumn";
interface HorarioSemanaProps {
    mail: string,
}

export interface SesionAsig extends Sesion {
  asignatura: string;
}
export const HorarioSemana =(props: HorarioSemanaProps)=>{
  
  const [sesiones, setSesiones] = useState<SesionAsig[]|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [props.mail]);


  return (
    <div className="dia">
      
      {loading && <h1>loading</h1>}
      {sesiones && <DiaBox key={sesiones.at(0)!.dia} dia={sesiones.at(0)!.dia} sesiones={sesiones}/>}
    </div>
  )
}
