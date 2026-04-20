export type Sesion ={
    aula: string,
    asignatura: string,//nombre de asignatura+' '+Practica/teoria+' '+grupo
    dia: 'L'|'M'|'X'|'J'|'V' , 
    horaInicio: Hora,
    horaFin: Hora,
}

export type Hora = {
    hora: number,
    minuto: number
}