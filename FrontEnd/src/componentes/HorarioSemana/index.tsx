import { Excepcion, Sesion } from "@/types";
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
    const rellenarDia =  (sesionesDia: SesionAsig[], dia: string): SesionAsig[] => {
      const resultado: SesionAsig[] = sesionesDia;

      for (let h = 8; h < 22; h++) {//rellenar un dia de 08:00 a 22:00
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
    const FechaToDia = (dia:string, lunes: string, martes: string, miercoles: string, jueves: string, viernes: string) =>{
    let fecha;
    switch (dia){
        case 'L':
            return lunes
        case 'M':
            return martes
        case 'X':
            return miercoles
        case 'J':
            return jueves
        default:
            return viernes
    }
}
    const SesionToExcepcionAsig = (sesiones: SesionAsig[], lunes: string, martes: string, miercoles: string, jueves: string, viernes: string): SesionAsig[] => {
      return sesiones.map((sesion)=>{
          const fecha = FechaToDia(sesion.dia, lunes, martes, miercoles, jueves,viernes)
          const excepcion:SesionAsig = {
            aula: sesion.aula,
            dia: fecha,
            horaInicio: sesion.horaInicio,
            horaFin: sesion.horaFin,
            asignatura: sesion.asignatura
          }
          return excepcion;
        })
    }
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
        const hoy = new Date();
        const lunesSemana = new Date(hoy);
        lunesSemana.setDate(hoy.getDate() - (hoy.getDay() === 0 ? 6 : hoy.getDay() - 1));
        const e = hoy.getDay() 
        const format = (d: Date) => d.toISOString().split('T')[0];
        const fechaLunes = format(lunesSemana);
        const fechaMartes = format(new Date(lunesSemana.setDate(lunesSemana.getDate() + 1)));
        const fechaMiercoles = format(new Date(lunesSemana.setDate(lunesSemana.getDate() + 1)));
        const fechaJueves = format(new Date(lunesSemana.setDate(lunesSemana.getDate() + 1)));
        const fechaViernes = format(new Date(lunesSemana.setDate(lunesSemana.getDate() + 1)));
        const semanaActual = SesionToExcepcionAsig(sesionesFront, fechaLunes, fechaMartes, fechaMiercoles, fechaJueves, fechaViernes)
        const lunes = rellenarDia(semanaActual.filter((s: Sesion) => s.dia === fechaLunes), fechaLunes);
        const martes = rellenarDia(semanaActual.filter((s: Sesion) => s.dia === fechaMartes), fechaMartes); 
        const miercoles = rellenarDia(semanaActual.filter((s: Sesion) => s.dia === fechaMiercoles), fechaMiercoles);
        const jueves = rellenarDia(semanaActual.filter((s: Sesion) => s.dia === fechaJueves), fechaJueves);
        const viernes = rellenarDia(semanaActual.filter((s: Sesion) => s.dia === fechaViernes), fechaViernes);

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
