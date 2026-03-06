

import { ObjectId } from "mongodb"
import { getDb } from "../mongo"

import { Asignatura, Aula, Excepcion, GrupoAsignatura, Hora, PrivilegiosAsignatura, PrivilegiosAula, PrivilegiosGrupoAsignatura, PrivilegiosUsuario, Sesion, sesionAula, Usuario } from "../tipos"


const ColeccionPrivilegios = "Privilegios"
const ColeccionAsignaturas = "Asignaturas"
const ColeccionTeoria = "Teoria"
const ColeccionPractica = "Practica"
const ColeccionAula = "Aulas"
const ColeccionAlumnos= "Alumnos"
const ColeccionProfesores = "Profesores"


export const crearPrivilegiosUsuario = async (req: any, res: any)=>{
    const nombre = req.body?.nombre 
    const idUsuario = req.body?.idUsuario 
    const tipoUsuario = req.body?.tipoUsuario
    const datosBasicos:boolean = req.body?.datosBasicos 
    const asignaturas:boolean = req.body?.asignaturas 
    let coleccion = '';
    const db = getDb()
    const eMsg:string[] = []
    if(tipoUsuario && typeof(tipoUsuario)=="string" ){
        if(tipoUsuario=='Alumno'){
            coleccion=ColeccionAlumnos
        }else if(tipoUsuario=='Profesor'){
            coleccion=ColeccionProfesores
        }else{
            eMsg.push("tipoUsuario debe ser un 'Alumno' o 'Profesor' ")
        }
    }else{
        eMsg.push("tipoUsuario debe ser un string")
    }
    if(!idUsuario || typeof(idUsuario)!="string" || !ObjectId.isValid(idUsuario) ){
        eMsg.push("idUsuario debe ser un string de 24 caracteres hexadecimales")
    }else{
        if(coleccion!=''){
            const grupo = await db.collection(coleccion).findOne({ _id: new ObjectId(idUsuario) });
            if(!grupo){
                eMsg.push("No se encuentra ese usuario")
            }
        }
    }
    if(datosBasicos!=true && asignaturas!=true){
        eMsg.push("debes asignar algún permiso como verdadero debe ser un string")
    }
    if(eMsg.length >0){
        res.status(401).json({message: eMsg})
    }else{
        const datos:PrivilegiosUsuario ={
            nombre: nombre,
            objetivo: idUsuario,
            miembros: [],
            datosBasicos: datosBasicos,
            asignaturas: asignaturas,
        }
        const result = await db.collection(ColeccionPrivilegios).insertOne(datos)
        return result
    }
}
export const crearPrivilegiosAula = async (req: any, res: any)=>{
    const nombre = req.body?.nombre 
    const idAula = req.body?.idAula 
    const eliminarHorarios:boolean = req.body?.eliminarHorarios
    const cambiarNombre:boolean = req.body?.cambiarNombre
    const eliminarAula:boolean = req.body?.eliminarAula 
    const db = getDb()
    const eMsg:string[] = []

    if(!idAula || typeof(idAula)!="string" || !ObjectId.isValid(idAula) ){
        eMsg.push("idAula debe ser un string de 24 caracteres hexadecimales")
    }else{
        const grupo = await db.collection(ColeccionAula).findOne({ _id: new ObjectId(idAula) });
        if(!grupo){
            eMsg.push("No se encuentra ese usuario")
        }
    }
    if(eliminarHorarios!=true && cambiarNombre!=true && eliminarAula!=true){
        eMsg.push("debes asignar algún permiso como verdadero debe ser un string")
    }
    if(eMsg.length >0){
        res.status(401).json({message: eMsg})
    }else{
        const datos:PrivilegiosAula ={
            nombre: nombre,
            objetivo: idAula,
            miembros: [],
            eliminarHorarios: eliminarHorarios,
            cambiarNombre: cambiarNombre,
            eliminarAula: eliminarAula
        }
        const result = await db.collection(ColeccionPrivilegios).insertOne(datos)
        return result
    }
}
export const crearPrivilegiosAsignatura = async (req: any, res: any)=>{
    const nombre = req.body?.nombre 
    const idAsignatura = req.body?.idAsignatura 
    const cambiarBasicos:boolean = req.body?.eliminarHorarios
    const cambiarGrupos:boolean = req.body?.cambiarNombre
    
    const db = getDb()
    const eMsg:string[] = []

    if(!idAsignatura || typeof(idAsignatura)!="string" || !ObjectId.isValid(idAsignatura) ){
        eMsg.push("idAsignatura debe ser un string de 24 caracteres hexadecimales")
    }else{
        const grupo = await db.collection(ColeccionAsignaturas).findOne({ _id: new ObjectId(idAsignatura) });
        if(!grupo){
            eMsg.push("No se encuentra ese usuario")
        }
    }
    if(cambiarBasicos!=true && cambiarGrupos!=true){
        eMsg.push("debes asignar algún permiso como verdadero debe ser un string")
    }
    if(eMsg.length >0){
        res.status(401).json({message: eMsg})
    }else{
        const datos:PrivilegiosAsignatura ={
            nombre: nombre,
            objetivo: idAsignatura,
            miembros: [],
            cambiarBasicos: cambiarBasicos,
            cambiarGrupos: cambiarGrupos
        }
        const result = await db.collection(ColeccionPrivilegios).insertOne(datos)
        return result
    }
}
export const crearPrivilegiosGrupoAsignatura = async (req: any, res: any)=>{
    const nombre = req.body?.nombre 
    const idGrupo = req.body?.idGrupo 
    const tipo = req.body?.tipo 
    const datosBasicos:boolean = req.body?.datosBasicos
    const datosAvanzados:boolean = req.body?.datosAvanzados
    const horarios:boolean = req.body?.horarios
    const excepciones:boolean = req.body?.excepciones
    
    let coleccion = '';
    const db = getDb()
    const eMsg:string[] = []
    if(tipo && typeof(tipo)=="string" ){
        if(tipo=='Alumno'){
            coleccion=ColeccionAlumnos
        }else if(tipo=='Profesor'){
            coleccion=ColeccionProfesores
        }else{
            eMsg.push("tipo debe ser un 'Alumno' o 'Profesor' ")
        }
    }else{
        eMsg.push("tipo debe ser un string")
    }
    if(!idGrupo || typeof(idGrupo)!="string" || !ObjectId.isValid(idGrupo) ){
        eMsg.push("idGrupo debe ser un string de 24 caracteres hexadecimales")
    }else{
        const grupo = await db.collection(coleccion).findOne({ _id: new ObjectId(idGrupo) });
        if(!grupo){
            eMsg.push("No se encuentra ese usuario")
        }
    }
    if(datosBasicos!=true && datosAvanzados!=true && horarios!=true && excepciones!=true){
        eMsg.push("debes asignar algún permiso como verdadero debe ser un string")
    }
    if(eMsg.length >0){
        res.status(401).json({message: eMsg})
    }else{
        const datos:PrivilegiosGrupoAsignatura ={
            nombre: nombre,
            objetivo: idGrupo,
            miembros: [],
            datosBasicos: datosBasicos,
            datosAvanzados: datosAvanzados,
            horarios: horarios,
            excepciones: excepciones
        }
        const result = await db.collection(ColeccionPrivilegios).insertOne(datos)
        return result
    }
}
