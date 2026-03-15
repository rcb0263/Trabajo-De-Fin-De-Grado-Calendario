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
export type sesionAula ={
    asignatura: string, 
    dia: 'L'|'M'|'X'|'J'|'V' , 
    horaInicio: Hora,
    horaFin: Hora,
}

export type Aula = {
    _id?: ObjectId,
    privilegios: string[],
    aula: string,
    horarios: sesionAula[],
    exepciones: Excepcion[]
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
    passwordHash: string,    
    mail: string,
    asignaturas: string[] //id de la asignatura
    fechaDeCreacion: Date
}





export type GrupoPrivilegioTipo =
  | PrivilegiosAsignatura
  | PrivilegiosGrupoAsignatura
  | PrivilegiosAula
  | PrivilegiosUsuario

export type GrupoPrivilegio = {
  _id?: ObjectId
  nombre: string
  objetivo: string // user / grupo / asignatura...
  miembros: MiembroGrupo[]
}

export type PrivilegiosAula = GrupoPrivilegio & {
    basicos: boolean,
    avanzados: boolean
}
export type PrivilegiosAsignatura = GrupoPrivilegio & {
    basicos: boolean,
    avanzados: boolean
}
export type PrivilegiosGrupoAsignatura = GrupoPrivilegio & {
    basicos: boolean, //basicos: asignatura, grupo, tipo, horarios
    avanzados: boolean, //avanzados: profesores, alumnos
    profesores: boolean
}
export type PrivilegiosUsuario = GrupoPrivilegio & {
    basicos: boolean,
    avanzados: boolean,
    asignaturas:boolean
}

export type PrivilegiosAdmin ={
    _id?: ObjectId,
    admin: 'Admin',
    nombre: string,
    miembros: string[]
}
export type MiembroGrupo ={
    miembro: string,
    fechaFin: string //  dd/mm/yyyy
}


