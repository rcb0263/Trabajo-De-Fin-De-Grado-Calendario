

import { ObjectId } from "mongodb"
import { getDb } from "../mongo"

import { Administrador, Asignatura, Aula, GrupoAsignatura, GrupoPrivilegio, GrupoPrivilegioTipo, MiembroGrupo, PrivilegiosAdmin, PrivilegiosAsignatura, PrivilegiosAula, PrivilegiosGrupoAsignatura, PrivilegiosUsuario, PrivTargets, Usuario } from "../tipos"
import { NextFunction } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


const ColeccionPrivilegios = "Privilegios"
const ColeccionAsignaturas = "Asignaturas"
const ColeccionTeoria = "Teoria"
const ColeccionPractica = "Practica"
const ColeccionAula = "Aulas"
const ColeccionAlumnos= "Alumnos"
const ColeccionProfesores = "Profesores"
const ColeccionAdmin = "Admin"
const ColeccionTrue = "UV"
const SECRET = process.env.SECRET||""; 
const PEPPER = process.env.PEPPER_SECRET||"";
const MAIL_UV = process.env.MAIL_UV||"";


export const CrearTrueUser = async (req: any, res: any)=>{
    const db = getDb()
    const mail=MAIL_UV
    const passEncripta = await bcrypt.hash("CalNe123"+PEPPER,10)
    const datos:Administrador ={
        nombre: "CalNe",
        mail: mail,
        passwordHash: passEncripta,
        fechaDeCreacion: new Date()
    }
    if(!mail){
        return res.status(400).json({message: "mail no se ha cargado correctamente"})
    }else{
        const existeMail = await db
        .collection<Usuario>(ColeccionTrue)
        .countDocuments({ mail });
        if(existeMail){
            return res.status(400).json({message: "ya hay un usuario verdadero"})
        }
    }
    const result = await db.collection(ColeccionTrue).insertOne(datos)
    return res.status(201).json(result)
}
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
export const CrearAdmin= async (req: any, res: any)=>{
    const nombre:string = req.body?.nombre //   grupo: string
    const mail:string = req.body?.mail //   grupo: string
    const password:string = req.body?.password
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
        .collection(ColeccionAdmin)
        .countDocuments({ mail });

        if (existeMail >0) {
        eMsg.push("Ya existe un administador con ese correo electrónico");
        }
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const passEncripta = await bcrypt.hash(password,10)
        const datos:Administrador ={
            nombre: nombre,
            mail: mail,
            passwordHash: passEncripta,
            fechaDeCreacion: new Date()
        }
        const result = await db.collection(ColeccionAdmin).insertOne(datos)
        return res.status(201).json(result)
    }
}
export const crearUsuario = async (req: any, res: any, tipoUsuario:string)=>{
    const nombre:string = req.body?.nombre //   grupo: string
    const mail:string = req.body?.mail //   grupo: string
    const password:string = req.body?.password
    console.log('pepper: '+PEPPER)
    let coleccion = ''
    const db = getDb()
    const eMsg:string[] = []
    if(tipoUsuario=='Alumno'){
        coleccion=ColeccionAlumnos
    }else if(tipoUsuario=='Profesor'){
        coleccion=ColeccionProfesores
    }else{
        return res.status(400).json({message: 'el tipo esta mal en el codigo'})
    }
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
        .collection<Usuario>(ColeccionAlumnos)
        .countDocuments({ mail });
        const existeMail2 = await db
        .collection<Usuario>(ColeccionProfesores)
        .countDocuments({ mail });
        const existeMail3 = await db
        .collection<Administrador>(ColeccionAdmin)
        .countDocuments({ mail });

        if (existeMail >0||existeMail2 >0||existeMail3 >0) {
        eMsg.push("Ya existe un usuario con ese correo electrónico");
        }
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const passEncripta = await bcrypt.hash(password+PEPPER,10)
        const datos:Usuario ={
            privilegios: [],
            nombre: nombre,
            mail: mail,
            passwordHash: passEncripta,
            asignaturas: [],
            fechaDeCreacion: new Date()
        }
        const result = await db.collection(coleccion).insertOne(datos)
        return res.status(201).json(result)
    }
}
export const logIn = async (req:any, res:any, tipoUsuario:string)=>{
    const mail:string = req.body?.mail
    const password:string = req.body?.password
    let coleccion = ''
    const db = getDb()
    const eMsg:string[] = []
    if(tipoUsuario=='Alumno'){
        coleccion=ColeccionAlumnos
    }else if(tipoUsuario=='Profesor'){
        coleccion=ColeccionProfesores
    }else if(tipoUsuario=='Administrador'){
        coleccion=ColeccionAdmin
    }else{
        return res.status(400).json({message: 'el tipo esta mal en el codigo'})
    }

    if(!password || typeof(password)!="string"){
        return res.status(400).json({message:"password debe ser un string"})
    }
    const user = await db.collection<Usuario>(coleccion).findOne({mail})
    if(!user) {
        eMsg.push("Usuario no encontrado")
    }else{

        const validPass = await bcrypt.compare(password+PEPPER, user.passwordHash)
        if(!validPass) {
            eMsg.push("contraseña incorrecta")
        }
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const token = jwt.sign({userId: user!._id?.toString(), mail: user!.mail, tipo: tipoUsuario}, SECRET,{
            expiresIn: "1h"
            })
        return res.status(200).json(token)
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

export const ModificarUsuarioBasico = async (req: any, res: any, tipoUsuario:string)=>{
    const nombre:string = req.body?.nombre
    const mail:string = req.body?.mail
    const password:string = req.body?.password
    let coleccion = ''
    const db = getDb()
    const eMsg:string[] = []
    if(tipoUsuario=='Alumno'){
        coleccion=ColeccionAlumnos
    }else if(tipoUsuario=='Profesor'){
        coleccion=ColeccionProfesores
    }else{
        return res.status(400).json({message: 'el tipo esta mal en el codigo'})
    }
    if(!nombre && !password){
        eMsg.push("debes introducir al menos un cambio")
    }
    if(nombre && typeof(nombre)!="string"){
        eMsg.push("nombre debe ser un string")
    }
    if(password && typeof(password)!="string"){
        eMsg.push("password debe ser un string")
    }
    if(!mail || typeof(mail)!="string"||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)){
        eMsg.push("mail debe ser un correo electronico valido")
    }else{
        const existeMail = await db
        .collection(coleccion)
        .findOne({ mail });

        if (!existeMail) {
            eMsg.push("No existe un "+ tipoUsuario +" con ese correo electrónico");
        }
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const datosModificar: any = {}
        if (nombre) datosModificar.nombre = nombre
        if (password) datosModificar.passwordHash = await bcrypt.hash(password,10)


        const result = await db.collection(coleccion).updateOne(
            { mail },
            { $set: datosModificar }
        )
        return res.status(201).json(result)
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
            {_id: new ObjectId(idObjetivo)},
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
            {_id: new ObjectId(idObjetivo)},
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


export const eliminarGrupoPrivilegios = async (req: any, res: any)=>{
    const nombre:string = req.body?.nombre 
    const objetivo:string = req.body?.objetivo 
    const tipo:string = req.body?.tipo 
    const db = getDb()
    const eMsg:string[] = []
    let coleccion = ''
    if(tipo == 'Alumno'){
        coleccion= ColeccionAlumnos
    }else if(tipo == 'Profesor'){
        coleccion= ColeccionProfesores
    }else if(tipo == 'Asignatura'){
        coleccion= ColeccionAsignaturas
    }else if(tipo == 'Teoria'){
        coleccion= ColeccionTeoria
    }else if(tipo == 'Practica'){
        coleccion= ColeccionPractica
    }else if(tipo == 'Aula'){
        coleccion= ColeccionAula
    }
    if(!nombre|| typeof(nombre)!="string" ){
        const resultado =  await db.collection<GrupoPrivilegio>(ColeccionPrivilegios).findOne({ nombre: nombre })
        if(!resultado){
            eMsg.push('No existe ese grupo')
        }
    }
    if(coleccion==''){
        eMsg.push('indica el tipo de objetivo Alumno, Profesor, Asignatura, ...')
    }
    if(!objetivo|| !ObjectId.isValid(objetivo)){
        eMsg.push('objetivo debe ser un string hexadecimal')
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{

        const resultado =  await db.collection<GrupoPrivilegio>(ColeccionPrivilegios).findOne({ nombre: nombre })
        const idObjetivo= new ObjectId(resultado?.objetivo)

         const result = await db.collection<PrivTargets>(coleccion).updateOne(
                {_id: idObjetivo},
                {$pull: {privilegios: String(resultado?._id)}}
            )
        const result2 = await db.collection<GrupoPrivilegio>(ColeccionPrivilegios).deleteOne(
            { nombre: nombre }
        )
        return res.status(200).json({result, result2})
        
    }
}

//añadir y quitar
export const añadirMiembroPrivilegios = async (req: any, res: any)=>{
    const mail:string = req.body?.mail
    const nombreGrupo: string = req.body?.nombreGrupo
    const tipoUsuario:string = req.body?.tipoUsuario
    const fechaFin:string = req.body?.fechaFin
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

//Obtiene segun el _id
export const GetGrupoPrivilegios = async (req: any, res: any) => {
    const id: string = req.body.id
    const db = getDb()
    if(!id ||  typeof(id)!="string"|| !ObjectId.isValid(id)){
        return res.status(400).json({message: 'id debe ser un ObjectId valido'})
    }
    const grupo = await db.collection<GrupoPrivilegioTipo>(ColeccionPrivilegios).findOne(
        {_id: new ObjectId(id)}
    )
    
    if(!grupo){
        return res.status(400).json({message: 'No existe ese grupo'})
    }
    return res.status(200).json(grupo)
}

//Obtiene segun el objetivo
export const GetGrupoPrivilegiosObjetivo = async (req: any, res: any) => {
    const id: string = req.body.id
    const db = getDb()
    
    if(!id ||  typeof(id)!="string"|| !ObjectId.isValid(id)){
        return res.status(400).json({message: 'id debe ser un ObjectId valido'})
    }
    const grupo = await db.collection<GrupoPrivilegioTipo>(ColeccionPrivilegios).find
    (
        {objetivo: id}
    ).toArray()
    if(!grupo){
        return res.status(400).json({message: 'No existe ese grupo'})
    }
    return res.status(200).json(grupo)
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
    const grupos = await db.collection<PrivilegiosAdmin>(ColeccionPrivilegios).findOne({
        admin: 'Admin',
        "miembros.miembro": req.user.mail
    });
    
    if(grupos) {
        return true

    }
    return false
}
export const verifyAdmin = async (req: any,res: any, next: NextFunction)  => {
    const esAdministrador = await esAdmin(req, res)
    if (!esAdministrador) {
        return res.status(403).json({ message: "No tienes permisos de administrador" })
    }

    next()
}

export const verifyUsuario= async (req: any,res: any, next: NextFunction)  => {
    const esAdministrador = await esAdmin(req, res)
    if (!esAdministrador) {
        return res.status(403).json({ message: "No tienes permisos de administrador" })
    }

    next()
}

export const usuarioCorrecto= async (req: any,res: any)  => {
    if ( String(req.user.mail) == String(req.body.id)) {
        return true
    }
    return false

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