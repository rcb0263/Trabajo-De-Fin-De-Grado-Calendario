

import { ObjectId } from "mongodb"
import { getDb } from "../mongo"

import { Asignatura, Aula, GrupoAsignatura, GrupoPrivilegio, GrupoPrivilegioTipo, MiembroGrupo, PrivilegiosAdmin, PrivilegiosAsignatura, PrivilegiosAula, PrivilegiosGrupoAsignatura, PrivilegiosUsuario, Usuario } from "../tipos"
import { NextFunction } from "express"


const ColeccionPrivilegios = "Privilegios"
const ColeccionAsignaturas = "Asignaturas"
const ColeccionTeoria = "Teoria"
const ColeccionPractica = "Practica"
const ColeccionAula = "Aulas"
const ColeccionAlumnos= "Alumnos"
const ColeccionProfesores = "Profesores"


export const crearAdminGrupo = async (req: any, res: any)=>{
    const nombre:string = req.body?.nombre
    const db = getDb()
    const eMsg:string[] = []

    const nombreValido=await verifyNameValid(nombre)
    if(nombreValido.length!==0){
        eMsg.push(...nombreValido)
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const datos:PrivilegiosAdmin ={
            nombre: nombre,
            miembros: [],
            admin: "Admin"
        }
        const result = await db.collection(ColeccionPrivilegios).insertOne(datos)
        return res.status(200).json(result)
    }
}
/*
export const CrearAdmin = async (req: any, res: any)=>{
    const nombre:string = req.body?.nombre //   grupo: string
    const mail:string = req.body?.mail //   grupo: string
    const password:string = req.body?.password
    let coleccion = ''
    const db = getDb()
    const eMsg:string[] = []
    if(!nombre || typeof(nombre)!="string"){
        eMsg.push("nombre debe ser un string")
    }
    if(!password || typeof(password)!="string"){
        eMsg.push("password debe ser un string")
    }
    if(!mail || typeof(mail)!="string"||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)){
        eMsg.push("mail debe ser un correo electronico valido")
    }else{
        const existeMail = await db
        .collection(coleccion)
        .countDocuments({ mail });

        if (existeMail >0) {
        eMsg.push("Ya existe un "+ tipoUsuario +" con ese correo electrónico");
        }
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const passEncripta = await bcrypt.hash(password,10)
        const datos:Usuario ={
            nombre: nombre,
            mail: mail,
            passwordHash: passEncripta,
            asignaturas: [],
            fechaDeCreacion: new Date()
        }
        const result = await db.collection(coleccion).insertOne(datos)
        return res.status(201).json(result)
    }
}*/
export const crearPrivilegiosUsuario = async (req: any, res: any)=>{
    const nombre:string = req.body?.nombre 
    
    const idUsuario:string = req.body?.idUsuario 
    const tipoUsuario:string = req.body?.tipoUsuario
    
    const basicos:boolean = req.body?.basicos 
    const avanzados:boolean = req.body?.avanzados 
    const asignaturas:boolean = req.body?.asignaturas 
    let coleccion = '';
    const db = getDb()
    const eMsg:string[] = []
    const nombreValido=await verifyNameValid(nombre)
    if(nombreValido.length!==0){
        eMsg.push(...nombreValido)
    }
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
    if(basicos!=true && avanzados!=true && asignaturas!=true){
        eMsg.push("debes asignar algún permiso como verdadero debe ser un string")
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const datos:PrivilegiosUsuario ={
            nombre: nombre,
            objetivo: idUsuario,
            miembros: [],
            basicos: basicos,
            avanzados: avanzados,
            asignaturas: asignaturas,
        }
        const result = await db.collection(ColeccionPrivilegios).insertOne(datos)
        const result2 = await db.collection<Usuario>(coleccion).updateOne(
            {_id: new ObjectId(idUsuario)},
            { $addToSet: { privilegios: String(result.insertedId) } }
        )
        return res.status(200).json(result)
    }
}
export const crearPrivilegiosAula = async (req: any, res: any)=>{
    const nombre:string = req.body?.nombre 
    const idAula:string = req.body?.idAula 
    const basicos:boolean = req.body?.basicos
    const avanzados:boolean = req.body?.avanzados
    
    const db = getDb()
    
    const eMsg:string[] = []

    const nombreValido=await verifyNameValid(nombre)
    if(nombreValido.length!==0){
        eMsg.push(...nombreValido)
    }
    if(!idAula || typeof(idAula)!="string" || !ObjectId.isValid(idAula) ){
        eMsg.push("idAula debe ser un string de 24 caracteres hexadecimales")
    }else{
        const grupo = await db.collection(ColeccionAula).findOne({ _id: new ObjectId(idAula) });
        if(!grupo){
            eMsg.push("No se encuentra ese usuario")
        }
    }
    if(basicos!=true && avanzados!=true){
        eMsg.push("debes asignar algún permiso como verdadero debe ser un string")
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const datos:PrivilegiosAula ={
            nombre: nombre,
            objetivo: idAula,
            miembros: [],
            basicos: basicos,
            avanzados: avanzados,
        }
        const result = await db.collection(ColeccionPrivilegios).insertOne(datos)
        const result2 = await db.collection<Aula>(ColeccionAula).updateOne(
            {_id: new ObjectId(idAula)},
            { $addToSet: { privilegios: String(result.insertedId) } }
        )
        return res.status(200).json(result)
    }
}
export const crearPrivilegiosAsignatura = async (req: any, res: any)=>{
    const nombre:string = req.body?.nombre 
    const idAsignatura:string = req.body?.idAsignatura 
    const basicos:boolean = req.body?.eliminarHorarios
    const avanzados:boolean = req.body?.cambiarNombre
    
    const db = getDb()
    const eMsg:string[] = []

    const nombreValido=await verifyNameValid(nombre)
    if(nombreValido.length!==0){
        eMsg.push(...nombreValido)
    }

    if(!idAsignatura || typeof(idAsignatura)!="string" || !ObjectId.isValid(idAsignatura) ){
        eMsg.push("idAsignatura debe ser un string de 24 caracteres hexadecimales")
    }else{
        const grupo = await db.collection(ColeccionAsignaturas).findOne({ _id: new ObjectId(idAsignatura) });
        if(!grupo){
            eMsg.push("No se encuentra ese usuario")
        }
    }
    if(basicos!=true && avanzados!=true){
        eMsg.push("debes asignar algún permiso como verdadero debe ser un string")
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const datos:PrivilegiosAsignatura ={
            nombre: nombre,
            objetivo: idAsignatura,
            miembros: [],
            basicos: basicos,
            avanzados: avanzados
        }
        const result = await db.collection(ColeccionPrivilegios).insertOne(datos)
        const result2 = await db.collection<Asignatura>(ColeccionAsignaturas).updateOne(
            {_id: new ObjectId(idAsignatura)},
            { $addToSet: { privilegios: String(result.insertedId) } }
        )
        return res.status(200).json(result)
    }
}
export const crearPrivilegiosGrupoAsignatura = async (req: any, res: any)=>{
    const nombre:string = req.body?.nombre 
    const idGrupo:string = req.body?.idGrupo 
    const tipo:'Teoria'|'Practica'  = req.body?.tipo 
    const basicos:boolean = req.body?.basicos
    const avanzados:boolean = req.body?.avanzados
    const profesores:boolean = req.body?.profesores
    
    let coleccion = '';
    const db = getDb()
    const eMsg:string[] = []

    const nombreValido=await verifyNameValid(nombre)
    if(nombreValido.length!==0){
        eMsg.push(...nombreValido)
    }
    if(tipo && typeof(tipo)=="string" ){
        if(tipo=='Teoria'){
            coleccion=ColeccionTeoria
        }else if(tipo=='Practica'){
            coleccion=ColeccionPractica
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
    if(basicos!=true && avanzados!=true && profesores!=true ){
        eMsg.push("debes asignar algún permiso como verdadero debe ser un string")
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const datos:PrivilegiosGrupoAsignatura ={
            nombre: nombre,
            objetivo: idGrupo,
            miembros: [],
            basicos: basicos,
            avanzados: avanzados,
            profesores: profesores,
        }
        const result = await db.collection(ColeccionPrivilegios).insertOne(datos)
        const result2 = await db.collection<GrupoAsignatura>(coleccion).updateOne(
            {_id: new ObjectId(idGrupo)},
            { $addToSet: { privilegios: String(result.insertedId) } }
        )
        return res.status(200).json(result)
    }
}


//añadir y quitar
export const añadirMiembroPrivilegios = async (req: any, res: any)=>{
    const idUsuario:string = req.user.userId 
    const objetivo:string = req.body?.objetivo 
    const tipoUsuario = req.body?.tipoUsuario
    const fechaFin:string = req.body?.fechaFin

    let coleccion = '';
    const db = getDb()
    const eMsg:string[] = []
    if(fechaFin){
        const [dd, mm, yyyy] = fechaFin.split('/').map(Number);
        const date = new Date(yyyy, mm-1, dd )
        if (isNaN(date.getTime())) {
            eMsg.push("fechaFin debe ser una fecha en el formato dd/mm/yyyy")
        }
    }else{
        eMsg.push("debe incluir fechaFin, y debe ser una fecha en el formato dd/mm/yyyy")
    }
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
    if(!objetivo || typeof(objetivo)!="string" || !ObjectId.isValid(objetivo) ){
        eMsg.push("objetivo debe ser un string de 24 caracteres hexadecimales")
    }else{
        const grupo = await db.collection(ColeccionPrivilegios).findOne({ objetivo });
        if(!grupo||grupo.admin == 'Admin'){
            eMsg.push("No se encuentra ese grupo de privilegios")
        }
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const datos: MiembroGrupo ={
            miembro: idUsuario,
            fechaFin: fechaFin
        }
        const result = await db.collection<GrupoPrivilegio>(ColeccionPrivilegios).updateOne(
            { objetivo },
            { $addToSet: { miembros: datos } }
        )
        return res.status(200).json(result)
    }
}
export const eliminarMiembroPrivilegios = async (req: any, res: any)=>{
    const idUsuario:string = req.body?.idUsuario 
    const idPrivilegio:string = req.body?.idPrivilegio 
    const tipoUsuario = req.body?.tipoUsuario
    const fechaFin:string = req.body?.fechaFin

    let coleccion = '';
    const db = getDb()
    const eMsg:string[] = []
    if(fechaFin){
        const [dd, mm, yyyy] = fechaFin.split('/').map(Number);
        const date = new Date(yyyy, mm-1, dd )
        if (isNaN(date.getTime())) {
            eMsg.push("fechaFin debe ser una fecha en el formato dd/mm/yyyy")
        }
    }
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
    if(!idPrivilegio || typeof(idPrivilegio)!="string" || !ObjectId.isValid(idPrivilegio) ){
        eMsg.push("idPrivilegio debe ser un string de 24 caracteres hexadecimales")
    }else{
        const grupo = await db.collection(ColeccionPrivilegios).findOne({ _id: new ObjectId(idPrivilegio) });
        if(!grupo){
            eMsg.push("No se encuentra ese usuario")
        }
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const datos: MiembroGrupo ={
            miembro: idUsuario,
            fechaFin: ""
        }
        if(fechaFin){
            datos.fechaFin = fechaFin
        }
        const result = await db.collection(ColeccionPrivilegios).updateOne(
            {_id: new ObjectId(idPrivilegio)},
            { $addToSet: { miembros: datos } }
        )
        return res.status(200).json(result)
    }
}

//Expandir
export const ObtenerGruposPrivilegios = async (req: any, res: any) => {
    const privilegios: string[] = req.body.privilegios
    const db = getDb()
    const IdsPrivilegios = privilegios.map(id => new ObjectId(id))
    const grupos = await db.collection<GrupoPrivilegioTipo>(ColeccionPrivilegios).find(
        {
            _id: { 
                $in: IdsPrivilegios 
            },
            "miembros.miembro": req.user
        }).toArray()
    return grupos;
}

//Privilegios Generales
export const esPrivilegiadoBasico = async (req: any, res: any, next: NextFunction)=>{
    const grupos:GrupoPrivilegioTipo[] = await ObtenerGruposPrivilegios(req, res) as GrupoPrivilegioTipo[];
    if (!grupos.some((grupo)=>grupo.basicos == true) || await esAdmin(req, res)) {
        return res.status(403).json({ message: "No tienes permisos basicos" })
    }

    next()
}
export const esPrivilegiadoAvanzado = async (req: any, res: any, next: NextFunction) =>{
    const grupos:GrupoPrivilegioTipo[] = await ObtenerGruposPrivilegios(req, res) as GrupoPrivilegioTipo[];
    if (!grupos.some((grupo)=>grupo.avanzados == true) || await esAdmin(req, res)) {
        return res.status(403).json({ message: "No tienes permisos avanzados" })
    }

    next()
}

//Privilegios especificos
    //Usuario
export const esPrivilegiadoUsuarioAsignaturas = async (req: any, res: any, next: NextFunction)=>{
    const grupos:PrivilegiosUsuario[] = await ObtenerGruposPrivilegios(req, res) as PrivilegiosUsuario[];
    if (!grupos.some((grupo)=>grupo.asignaturas == true) || await esAdmin(req, res)) {
        return res.status(403).json({ message: "No tienes permisos de asignaturas" })
    }

    next()
}
    //Grupo Asignatura
export const esPrivilegiadoGrupoAsignaturaProfesores  = async (req: any, res: any, next: NextFunction) =>{
    const grupos:PrivilegiosGrupoAsignatura[] = await ObtenerGruposPrivilegios(req, res) as PrivilegiosGrupoAsignatura[];
    if (!grupos.some((grupo)=>grupo.profesores == true) || await esAdmin(req, res)) {
        return res.status(403).json({ message: "No tienes permisos de profesores" })
    }

    next()
}

//Admin
export const esAdmin = async (req: any, res: any) => {
    const db = getDb();

    const grupos = await db.collection<PrivilegiosAdmin>(ColeccionPrivilegios).findOne({
        admin: 'Admin',
        miembros: { $in: [req.user] }
    });
    if(grupos) return true
    return true
}
export const verifyAdmin = async (req: any,res: any, next: NextFunction)  => {
    const esAdministrador = await esAdmin(req, res)
    if (!esAdministrador) {
        return res.status(403).json({ message: "No tienes permisos de administrador" })
    }

    next()
}

const verifyNameValid = async (nombre:string) => {
    const db= getDb()
    if(!nombre || typeof(nombre)!="string" || nombre== '' ){
        return ["nombre debe ser un string"]
    }else{
        const grupo = await db.collection(ColeccionPrivilegios).findOne({nombre});
        if(grupo){
            return ["No se pueden repetir nombres"]
        }
        return []
    }
}