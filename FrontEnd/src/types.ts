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

export type Excepcion ={
    aula: string, 
    fecha: string,
    horaInicio: Hora,
    horaFin: Hora,
}
type sesionAula ={
    asignatura: string, 
    dia: 'L'|'M'|'X'|'J'|'V' , 
    horaInicio: Hora,
    horaFin: Hora,
}

export type Aula = {
    _id?: any,
    privilegios: string[], 
    aula: string,           //basico
    horarios: sesionAula[], //desde la asignatura
    exepciones: Excepcion[] //desde la asignatura
}

export type GrupoAsignatura ={ // {asignatura:asignatura, grupo:grupo}
    _id?: any,
    privilegios: string[],
    tipo: 'Teoria' | 'Practica',
    asignatura: string,
    profesores: string[],
    grupo: string,
    alumnos: string[],
    horarios: Sesion[],
    fechas: Excepcion[]
}
export type FrontHorarioAsignatura = {
  nombre: string;
  horario: Sesion[];
};
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
//encima de esto he creado asignaturas
export type Administrador ={
    _id?: any,
    nombre: string,
    mail: string,
    passwordHash: string,
    fechaDeCreacion: Date
}

export type Usuario ={
    _id?: any,
    privilegios: string[]
    nombre: string,         //basico
    passwordHash: string,   //basico 
    mail: string,           //avanzado
    asignaturas: string[]   //asignaturas
    fechaDeCreacion: Date
}



export type GrupoPrivilegioTipo =
  | PrivilegiosAsignatura
  | PrivilegiosGrupoAsignatura
  | PrivilegiosAula
  | PrivilegiosUsuario

export type GrupoPrivilegio = {
  _id?: any
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
    _id?: any,
    admin: 'Admin',
    nombre: string,
    miembros: string[]
}
export type MiembroGrupo ={
    miembro: string,
    fechaFin?: string //  dd/mm/yyyy
}


