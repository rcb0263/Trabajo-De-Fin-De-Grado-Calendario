import { Sesion } from "@/types";
import { horarioProfesor } from "@/lib/spi/horarios";
import { useEffect, useState } from "react";
import './styles.css'
interface HorarioSemanaProps {
    mail: string,
}

export const HorarioSemana =(props: HorarioSemanaProps)=>{
  
  const [sesiones, setSesiones] = useState<Sesion[][]|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = await horarioProfesor(props.mail);
        const sesionesFront = data.map((asig: any) =>
          asig.horario.map((sesion: any) => ({
            aula: sesion.aula,
            asignatura: asig.nombre,
            dia: sesion.dia,
            horaInicio: sesion.horaInicio,
            horaFin: sesion.horaFin,
          }))
        ).flat();
        const lunes = sesionesFront.filter((s: Sesion) => s.dia === 'L');
        const martes = sesionesFront.filter((s: Sesion) => s.dia === 'M');
        const miercoles = sesionesFront.filter((s: Sesion) => s.dia === 'X');
        const jueves = sesionesFront.filter((s: Sesion) => s.dia === 'J');
        const viernes = sesionesFront.filter((s: Sesion) => s.dia === 'V');

        setSesiones([lunes, martes, miercoles, jueves, viernes]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [props.mail]);


  return (
    <div className="semana">
      {loading && <h1>loading</h1>}
      {sesiones && sesiones.map((day)=>{
        return (
          <div className="dia" >
            {
            day.map(e=>{
              return <div className="sesion" key={`${e.asignatura}-${e.dia}-${e.horaInicio.hora}-${e.horaInicio.minuto}`}>
                <p>{e.asignatura}</p>
                <p>{e.aula}</p>
                <p>{e.dia}</p>
                <p>{e.horaInicio.hora+':'+(e.horaInicio.minuto==0 ? '00':'30')} - {e.horaFin.hora+':'+(e.horaFin.minuto==0 ? '00':'30')}</p>

              </div>
            })
            }
          </div>
        )
      })}
    </div>
  )
}
