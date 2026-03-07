import { ObjectId } from "mongodb"

export type Excepcion ={
    aula: string, 
    fecha: string,//'dd/mm/yyyy'
    horaInicio: Hora,
    horaFin: Hora,
}
export type Hora = {
    hora: number,
    minuto: number
}
export type Sesion ={
    aula: string, 
    dia: 'L'|'M'|'X'|'J'|'V' , 
    horaInicio: Hora,
    horaFin: Hora,
}

export type GrupoAsignatura ={
    _id?: ObjectId,
    privilegios: string[],
    tipo: 'Teoria' | 'Practica',
    asignatura: string,
    profesores: string[],
    grupo: string, //A, B, C, ...
    alumnos: string[],
    horarios: Sesion[],
    fechas: Excepcion[]
}


export type Asignatura = {
    _id?: ObjectId
    privilegios: string[],
    nombre: string
    grado: string,
    teoria: string[],
    practicas: string[],
    curso: number,
    año: number,
    semestre: 'Primero'|'Segundo',
    fechaDeCreacion: Date
}
//encima de esto he creado asignaturas
export type Administrador ={
   _id?: ObjectId,
   nombre: string,
   grupos: string[], //id de grupos de privilegio
   fechaDeCreacion: Date
}

export type Usuario ={
   _id?: ObjectId,
   nombre: string,
   mail: string,
   asignaturas: string[] //id de la asignatura
   fechaDeCreacion: Date
}



/*
export type Grupo = {
    _id?: ObjectId,
    nombre: string,
    miembros: MiembroGrupo[],
    privilegiosModificarLeve: PrivilegiosAsignatura[] | boolean,
    privilegiosModificarSerio: PrivilegiosUsuario | boolean,
    privilegiosProfesor: PrivilegiosUsuario | boolean,
    privilegiosAula: PrivilegiosAula[],
    privilegiosAdmin: privilegiosAdmin 
}
*/


export type PrivilegiosAula ={
    nombre: string,
    objetivo: string, //user/grupo/asignatura...
    miembros: MiembroGrupo[],
    eliminarHorarios: boolean,
    cambiarNombre: boolean
    eliminarAula: boolean
}
export type PrivilegiosAsignatura ={
    nombre: string,
    objetivo: string, //user/grupo/asignatura...
    miembros: MiembroGrupo[],
    cambiarBasicos: boolean,
    cambiarGrupos: boolean,
}
export type PrivilegiosGrupoAsignatura ={
    nombre: string,
    objetivo: string, //user/grupo/asignatura...
    miembros: MiembroGrupo[],
    datosBasicos: boolean, //asignatura, grupo, tipo
    datosAvanzados: boolean, //profesores, alumnos
    horarios: boolean,
    excepciones: boolean,
}
export type PrivilegiosUsuario={
    nombre: string,
    objetivo: string, //user/grupo/asignatura...
    miembros: MiembroGrupo[],
    datosBasicos: boolean,
    asignaturas:boolean,

}
export type privilegiosAdmin ={
    nombre: string,
    miembros: string[]
}

export type MiembroGrupo ={
    miembro: string,
    fechaFin?: string //  dd/mm/yyyy
}


export type Aula = {
    _id?: ObjectId,
    aula: string,
    horarios: sesionAula[],
    exepciones: Excepcion[]
}

export type sesionAula ={
    asignatura: string, 
    dia: 'L'|'M'|'X'|'J'|'V' , 
    horaInicio: Hora,
    horaFin: Hora,
}