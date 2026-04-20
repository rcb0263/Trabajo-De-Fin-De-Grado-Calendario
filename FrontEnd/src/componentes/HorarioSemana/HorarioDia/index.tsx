import { Sesion } from "@/types";
import { horarioProfesor } from "@/lib/spi/horarios";
import { useEffect, useState } from "react";
import './styles.css'
import { getDiaSemana, getFechaNumerica } from "@/componentes/funcionesComponentes";
interface HorarioSemanaProps {
    mail: string,
}

export const HorarioSemana =(props: HorarioSemanaProps)=>{
  
  const [sesiones, setSesiones] = useState<Sesion[]|null>(null);
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
      {sesiones && sesiones.map((e)=>{
        return (
           <div className="sesion" key={`${e.asignatura}-${e.dia}-${e.horaInicio.hora}-${e.horaInicio.minuto}`}>
              <p>{e.asignatura}</p>
              <p>{e.aula}</p>
              <p>{e.dia}</p>
              <p>{e.horaInicio.hora+':'+(e.horaInicio.minuto==0 ? '00':'30')} - {e.horaFin.hora+':'+(e.horaFin.minuto==0 ? '00':'30')}</p>
            </div>
        )
      })}
    </div>
  )
}
