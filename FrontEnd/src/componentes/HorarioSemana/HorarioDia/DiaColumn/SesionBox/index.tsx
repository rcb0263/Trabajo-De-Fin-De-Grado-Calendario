import { useEffect } from "react";
import { SesionAsig } from "../..";

type Props ={
    sesion: SesionAsig
}


export const SesionBox=(props: Props)=>{
    const {sesion} = props
    const {horaFin, horaInicio} = sesion
    const intervalos =
    (
        (horaFin.hora*2 + (horaFin.minuto ==0? 0:1 )) -
        (horaInicio.hora*2 + (horaInicio.minuto ==0? 0:1) )
    )
    const nombre = props.sesion.asignatura.split('Teoria')
    const nom = props.sesion.asignatura.split('Practica')
    sesion.aula!=='Libre'?console.log(props.sesion.asignatura):''
    const grupo = 'Teoria'.search(props.sesion.asignatura)?'Teoria':'Practica'
  useEffect(() => {

  }, [props]);

  return (
    <div onClick={()=>{
        
    }}
     className={`sesion ${sesion.aula === 'Libre' && sesion.asignatura === 'Libre' ? 'libre' : 'ocupado'}`} 
        style={{"--intervalos": intervalos} as React.CSSProperties} >
            
        {sesion.asignatura !== 'Libre' &&
            <>
            <p>{nombre.length>1?nombre[0]:nom[0]}</p>
            <p>{(nombre.length>1?('Teoria'+nombre[1]):('Practica'+nom[1]))}</p>
            </>    
        }
        {sesion.aula!='Libre' &&<p>{sesion.aula}</p>}
        { sesion.aula!='Libre'&&<p>{
        (horaInicio.hora<10?'0':'')+horaInicio.hora+':'+
        (horaInicio.minuto==0 ? '00':'30')} - 
        {
        (horaFin.hora<10?'0':'')+
        horaFin.hora+':'+(horaFin.minuto==0 ? '00':'30')}</p>
        }
    </div>
)
}

export const SesionHoraBox=(props: Props)=>{  
    const {sesion} = props
    const {horaFin} = sesion

  return (
    <div className="sesion horarioSesion" style={{"--intervalos": 1} as React.CSSProperties} >
        <p>{horaFin.hora+':'+(horaFin.minuto==0 ? '00':'30')}</p>
    </div>
)
}
