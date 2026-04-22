

import { ObjectId } from "mongodb"
import { getDb } from "../mongo"

import { Administrador, Asignatura, Aula, GrupoAsignatura, GrupoPrivilegio, GrupoPrivilegioTipo, MiembroGrupo, PrivilegiosAdmin, PrivilegiosAsignatura, PrivilegiosAula, PrivilegiosGrupoAsignatura, PrivilegiosUsuario, Usuario } from "../tipos"
import { NextFunction } from "express"


const ColeccionPrivilegios = "Privilegios"
const ColeccionAsignaturas = "Asignaturas"
const ColeccionTeoria = "Teoria"
const ColeccionPractica = "Practica"
const ColeccionAula = "Aulas"
const ColeccionAlumnos= "Alumnos"
const ColeccionProfesores = "Profesores"
const ColeccionAdmin = "Admin"
const ColeccionTrue = "UV"


export const crearAdminGrupo = async (req: any, res: any)=>{
    const nombre:string = req.body?.nombre
    const db = getDb()
    const eMsg:string[] = []

    const nombreValido=await verifyNameValid(nombre)
    if(nombreValido.length!==0){
        eMsg.push(...nombreValido)
    }
    const grupo = await db.collection(ColeccionAdmin).findOne({admin:'Admin'})
    if(grupo){
        eMsg.push('Ya existe un grupo de administradores')
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
export const añadirAdminPrivilegios = async (req: any, res: any)=>{
    const mail:string = req.body?.mail 
    const db = getDb()
    const eMsg:string[] = []

    if(!mail || typeof(mail)!="string"){
        eMsg.push("mail debe ser un string")
    }else{
        const admin = await db.collection<Administrador>(ColeccionAdmin).findOne({ mail: mail });
        if(!admin){
            eMsg.push("No se encuentra ese usuario")
        }
    }
    const grupo = await db.collection(ColeccionPrivilegios).findOne({ admin:'Admin' });
    if(!grupo||grupo.admin !== 'Admin'){
        eMsg.push("No se encuentra ese grupo de privilegios")
    }
    
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const datos: MiembroGrupo ={
            miembro: mail
        }
        const result = await db.collection<GrupoPrivilegio>(ColeccionPrivilegios).updateOne(
            { admin: 'Admin' },
            { $addToSet: { miembros: datos } }
        )
        return res.status(200).json(result)
    }
}

export const crearPrivilegiosUsuario = async (req: any, res: any)=>{
    const nombre:string = req.body?.nombre 
    
    const mail:string = req.body?.mail 
    const tipoUsuario:string = req.body?.tipoUsuario
    
    const basicos:boolean = req.body?.basicos 
    const avanzados:boolean = req.body?.avanzados 
    const asignaturas:boolean = req.body?.asignaturas 
    let coleccion = '';
    let idObjetivo='';
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
    if(!mail || typeof(mail)!="string"){
        eMsg.push("mail debe ser un string")
    }else{
        if(coleccion!=''){
            const usuario = await db.collection<Usuario>(coleccion).findOne({ mail });
            if(!usuario){
                eMsg.push("No se encuentra ese usuario")
            }
            idObjetivo=String(usuario?._id);
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
            objetivo: idObjetivo,
            miembros: [],
            basicos: basicos,
            avanzados: avanzados,
            asignaturas: asignaturas,
        }
        const result = await db.collection<PrivilegiosUsuario>(ColeccionPrivilegios).insertOne(datos)
        const result2 = await db.collection<Usuario>(coleccion).updateOne(
            {_id: new ObjectId(idObjetivo)},
            { $addToSet: { privilegios: String(result.insertedId) } }
        )
        return res.status(200).json(result)
    }
}
export const crearPrivilegiosAula = async (req: any, res: any)=>{
    const nombre:string = req.body?.nombre 
    const aula:string = req.body?.aula 
    const basicos:boolean = req.body?.basicos
    const avanzados:boolean = req.body?.avanzados
    
    let idObjetivo:string='';
    const db = getDb()
    
    const eMsg:string[] = []

    const nombreValido=await verifyNameValid(nombre)
    if(nombreValido.length!==0){
        eMsg.push(...nombreValido)
    }
    if(!aula || typeof(aula)!="string"){
        eMsg.push("aula debe ser un string ")
    }else{
        const grupo = await db.collection<Aula>(ColeccionAula).findOne({ aula: aula});
        if(!grupo){
            eMsg.push("No se encuentra ese aula")
        }
        idObjetivo = String(grupo?._id)
    }
    if(basicos!=true && avanzados!=true){
        eMsg.push("debes asignar algún permiso como verdadero debe ser un string")
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const datos:PrivilegiosAula ={
            nombre: nombre,
            objetivo: idObjetivo,
            miembros: [],
            basicos: basicos,
            avanzados: avanzados,
        }
        const result = await db.collection(ColeccionPrivilegios).insertOne(datos)
        const result2 = await db.collection<Aula>(ColeccionAula).updateOne(
            {idObjetivo},
            { $addToSet: { privilegios: String(result.insertedId) } }
        )
        return res.status(200).json(result)
    }
}
export const crearPrivilegiosAsignatura = async (req: any, res: any)=>{
    const nombre:string = req.body?.nombre 
    const nombreAsignatura = req.body?.nombreAsignatura
    const curso = req.body?.curso
    const basicos:boolean = req.body?.basicos
    const avanzados:boolean = req.body?.avanzados

    let idObjetivo:string =''

    const db = getDb()
    const eMsg:string[] = []
    console.log(req.body)
    const nombreValido=await verifyNameValid(nombre)
    if(nombreValido.length!==0){
        eMsg.push(...nombreValido)
    }
    if(!curso ||typeof(curso)!= "number" ){
        eMsg.push("curso debe ser un numero")
    }
    if(!nombreAsignatura || typeof(nombreAsignatura)!="string"){
        eMsg.push("nombreAsignatura debe ser un string")
    }else if(eMsg.length==0){
        const existeAsignatura = await db.collection<Asignatura>(ColeccionAsignaturas).findOne({nombre: nombreAsignatura, curso: curso})
        if(!existeAsignatura){
            eMsg.push("No existe esa asignatura")
        }else{
            console.log('existeAsignatura: '+existeAsignatura)
            idObjetivo=String(existeAsignatura._id)
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
            objetivo: idObjetivo,
            miembros: [],
            basicos: basicos,
            avanzados: avanzados
        }
        const result = await db.collection(ColeccionPrivilegios).insertOne(datos)
        const result2 = await db.collection<Asignatura>(ColeccionAsignaturas).updateOne(
            {idObjetivo},
            { $addToSet: { privilegios: String(result.insertedId) } }
        )
        return res.status(200).json(result)
    }
}
export const crearPrivilegiosGrupoAsignatura = async (req: any, res: any)=>{
    const nombre:string = req.body?.nombre 
    const nombreAsignatura:string = req.body?.nombreAsignatura 
    const curso = req.body?.curso 
    const grupo:string = req.body?.grupo 
    const tipo:'Teoria'|'Practica'  = req.body?.tipo 
    const basicos:boolean = req.body?.basicos
    const avanzados:boolean = req.body?.avanzados
    const profesores:boolean = req.body?.profesores
    
    let idObjetivo='';
    let idAsignatura='';
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
    if(!curso ||typeof(curso)!= "number" ){
        eMsg.push("curso debe ser un numero")
    }
    if(!nombreAsignatura || typeof(nombreAsignatura)!="string"){
        eMsg.push("nombreAsignatura debe ser un string")
    }else if(eMsg.length==0){
        const existeAsignatura = await db.collection<Asignatura>(ColeccionAsignaturas).findOne({nombre: nombreAsignatura, curso: curso})
        if(!existeAsignatura){
            eMsg.push("No existe esa asignatura")
        }else{
            idAsignatura=String(existeAsignatura._id)
        }
    }
    
    if(!grupo || typeof(grupo)!="string" ){
        eMsg.push("idGrupo debe ser un string ")
    }else{
        const existe = await db.collection<GrupoAsignatura>(coleccion).findOne({grupo, asignatura: idAsignatura});
        if(!existe){
            eMsg.push("No se encuentra ese usuario")
        }else{
            idObjetivo=String(existe._id)
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
            objetivo: idObjetivo,
            miembros: [],
            basicos: basicos,
            avanzados: avanzados,
            profesores: profesores,
        }
        const result = await db.collection(ColeccionPrivilegios).insertOne(datos)
        const result2 = await db.collection<GrupoAsignatura>(coleccion).updateOne(
            {_id: new ObjectId(idObjetivo)},
            { $addToSet: { privilegios: String(result.insertedId) } }
        )
        return res.status(200).json(result)
    }
}


//añadir y quitar
export const añadirMiembroPrivilegios = async (req: any, res: any)=>{
    const mail:string = req.body?.mail
    const nombreGrupo: string = req.body?.nombreGrupo //no hay dos con el mismo
    const tipoUsuario:string = req.body?.tipoUsuario
    const fechaFin:string = req.body?.fechaFin
    console.log('111')
    let coleccion = '';
    const db = getDb()
    const eMsg:string[] = []
    if(fechaFin){
        const [yyyy, mm, dd] = fechaFin.split('-').map(Number);
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
    if(!mail || typeof(mail)!="string" ){
        eMsg.push("mail debe ser un string")
    }else{
        if(coleccion!=''){
            const usuario = await db.collection<Usuario>(coleccion).findOne({mail });
            if(!usuario){
                eMsg.push("No se encuentra ese usuario")
            }
        }
    }
    if(!nombreGrupo || typeof(nombreGrupo)!="string" ){
        eMsg.push("nombreGrupo debe ser un string")
    }else{
        const grupo = await db.collection<GrupoPrivilegio>(ColeccionPrivilegios).findOne({ nombre: nombreGrupo, admin: { $ne: 'Admin' } });
        if(!grupo){
            eMsg.push("No se encuentra ese grupo de privilegios")
        }
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const datos: MiembroGrupo ={
            miembro: mail   ,
            fechaFin: fechaFin
        }
        const result = await db.collection<GrupoPrivilegio>(ColeccionPrivilegios).updateOne(
            { nombre: nombreGrupo, admin: { $ne: 'Admin' } },
            { $addToSet: { miembros: datos } }
        )
        return res.status(200).json(result)
    }
}
export const eliminarMiembroPrivilegios = async (req: any, res: any)=>{
    const mail:string = req.body?.mail
    const nombreGrupo: string = req.body?.nombreGrupo //no hay dos con el mismo
    const tipoUsuario:string = req.body?.tipoUsuario

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
    if(!mail || typeof(mail)!="string" ){
        eMsg.push("mail debe ser un string")
    }else{
        if(coleccion!=''){
            const grupo = await db.collection(coleccion).findOne({mail });
            if(!grupo){
                eMsg.push("No se encuentra ese usuario")
            }
        }
    }
    if(!nombreGrupo || typeof(nombreGrupo)!="string" ){
        eMsg.push("nombreGrupo debe ser un string")
    }else{
        const grupo = await db.collection(ColeccionPrivilegios).findOne({ nombre: nombreGrupo, admin: { $ne: 'Admin' } });
        if(!grupo){
            eMsg.push("No se encuentra ese grupo de privilegios")
        }
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        
        const result = await db.collection<GrupoPrivilegio>(ColeccionPrivilegios).updateOne(
            { nombre: nombreGrupo, admin: { $ne: 'Admin' } },
            { $pull: { miembros: { miembro: mail } } }
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
            "miembros.miembro": req.user.mail
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
    console.log('re')
    const grupos = await db.collection<PrivilegiosAdmin>(ColeccionPrivilegios).findOne({
        admin: 'Admin',
        "miembros.miembro": req.user.mail
    });
    console.log(grupos)
    if(grupos) return true
    return false
}
export const verifyAdmin = async (req: any,res: any, next: NextFunction)  => {
    console.log('res:')
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