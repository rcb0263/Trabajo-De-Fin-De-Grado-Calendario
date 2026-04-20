export type Sesion ={
    aula: string,
    dia: 'L'|'M'|'X'|'J'|'V' , 
    horaInicio: Hora,
    horaFin: Hora,
}

export type Hora = {
    hora: number,
    minuto: number
}