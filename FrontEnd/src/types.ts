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

export type Asignatura = {
    _id?: any
    privilegios: string[],
    nombre: string,                 //basico
    grado: string,                  //basico
    teoria: string[],               //avanzado
    practicas: string[],            //avanzado
    curso: number,                  //basico 2020, 2021, 2022, ...
    año: number,                    //basico 1º,2º,3º,4º,...
    semestre: 'Primero'|'Segundo',  //basico
    fechaDeCreacion: Date
}