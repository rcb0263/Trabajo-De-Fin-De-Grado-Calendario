import { Sesion } from "@/types";
import { horarioProfesor } from "@/lib/spi/horarios";
import { useEffect, useState } from "react";
import './styles.css'
import { ColumnHoras, DiaBox } from "./HorarioDia/DiaColumn";
interface HorarioSemanaProps {
    mail: string,
}
interface SesionAsig extends Sesion {
  asignatura: string;
}
export const HorarioSemana =(props: HorarioSemanaProps)=>{
  
  const [sesiones, setSesiones] = useState<SesionAsig[][]|null>(null);
  const [horas, setHoras] = useState<SesionAsig[]|null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const rellenarDia =  (sesionesDia: SesionAsig[], dia: ('L'|'X'|'M'|'J'|'V')): SesionAsig[] => {
      const resultado: SesionAsig[] = sesionesDia;

      for (let h = 8; h <= 22; h++) {//rellenar un dia de 08:00 a 22:00
        for (let m = 0; m < 60; m += 30) {//X:00 o X:30, después se pasa
          const inicio = { hora: h, minuto: m };
          const fin = m === 0 ? { hora: h, minuto: 30 }: { hora: h + 1, minuto: 0 };

          const Libre:boolean = sesionesDia.every((s) =>{
            return(
              ((s.horaFin.hora < inicio.hora ||(s.horaFin.hora == inicio.hora && s.horaFin.minuto <= inicio.minuto)) || 
              (fin.hora <s.horaInicio.hora||(fin.hora == s.horaInicio.hora && fin.minuto <= s.horaInicio.minuto)))
            )
          }
           
          );

          if (Libre) {
            resultado.push({
              aula: 'Libre',
              asignatura: 'Libre',
              dia,
              horaInicio: inicio,
              horaFin: fin,
            });
          }
        }
      }
      resultado.sort((a, b) => {
        if (a.horaInicio.hora !== b.horaInicio.hora) {
          return a.horaInicio.hora - b.horaInicio.hora;
        }

        return a.horaInicio.minuto - b.horaInicio.minuto;
      });
      return resultado;
    };
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
        const lunes = rellenarDia(sesionesFront.filter((s: Sesion) => s.dia === 'L'), 'L');
        const martes = rellenarDia(sesionesFront.filter((s: Sesion) => s.dia === 'M'), 'M'); 
        const miercoles = rellenarDia(sesionesFront.filter((s: Sesion) => s.dia === 'X'), 'X');
        const jueves = rellenarDia(sesionesFront.filter((s: Sesion) => s.dia === 'J'), 'J');
        const viernes = rellenarDia(sesionesFront.filter((s: Sesion) => s.dia === 'V'), 'V');

        setSesiones([lunes, martes, miercoles, jueves, viernes]);
      }finally {
        setLoading(false);
      }
    };
    setHoras(rellenarDia([], 'L'))
    fetchData();
  }, [props.mail]);


  return (
    <div className="semana">
      {loading && <h1>loading</h1>}
      {horas && <ColumnHoras sesiones={horas}/>}
      {sesiones && sesiones.map((dia)=>{
        return (
          <DiaBox key={dia.at(0)!.dia} dia={dia.at(0)!.dia} sesiones={dia}/>
        )
      })}
    </div>
  )
}
