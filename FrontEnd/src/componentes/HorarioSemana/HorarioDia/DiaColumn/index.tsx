import { useEffect } from "react";
import { SesionBox, SesionHoraBox } from "./SesionBox";
import { SesionAsig } from "..";

type Props ={
    dia: string,
    sesiones: SesionAsig[]
}

export const DiaBox=(props: Props)=>{  

  useEffect(() => {

  }, [props]);


        return (
          <div className="dia" key={props.sesiones.at(0)?.dia} >
            <p>{ props.sesiones.at(0)?.dia=='L'?'Lunes'
                :props.sesiones.at(0)?.dia=='M'?'Martes'
                :props.sesiones.at(0)?.dia=='X'?'Miercoles'
                :props.sesiones.at(0)?.dia=='J'?'Jueves'
                :props.sesiones.at(0)?.dia=='V'?'Viernes'
                :props.sesiones.at(0)?.dia}</p>
            {
            props.sesiones.map(e=>{
              return (
              <SesionBox key={`${e.asignatura}-${e.dia}-${e.horaInicio.hora}-${e.horaInicio.minuto}`} sesion={e}/>
              )
            })
            }
          </div>
        )
}

type ColumnHorasProps ={
    sesiones: SesionAsig[]
}
export const ColumnHoras=(props: ColumnHorasProps)=>{  

  useEffect(() => {

  }, [props]);


        return (
          <div className="dia"style={{ borderTop: "0px transparent" }} ><p className=" horarioSesion horarioColumna">08:00</p>
            {
            props.sesiones.map(e=>{
              return (
              <SesionHoraBox key={`${e.asignatura}-${e.dia}-${e.horaInicio.hora}-${e.horaInicio.minuto}`} sesion={e}/>
              )
            })
            }
          </div>
        )
}
