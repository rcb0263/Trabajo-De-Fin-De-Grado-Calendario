import { ObjectId } from "mongodb"
import { getDb } from "../mongo"
import { Usuario } from "../tipos"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


const ColeccionAlumnos= "Alumnos"
const ColeccionProfesores = "Profesores"

const SECRET = process.env.SECRET||""; 


export const crearUsuario = async (req: any, res: any, tipoUsuario:string)=>{
    const nombre:string = req.body?.nombre //   grupo: string
    const mail:string = req.body?.mail //   grupo: string
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
        return result
    }
}
export const eliminarUsuario = async (req: any, res: any, tipoUsuario:string)=>{
    const mail:string = req.body?.mail //   grupo: string
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
        const result = await db.collection(coleccion).deleteOne({mail: mail})
        return result
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
        return result
    }
}
export const ModificarUsuarioAvanzados = async (req: any, res: any, tipoUsuario:string)=>{
    const mail:string = req.body?.mail
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
        const result = await db.collection(coleccion).updateOne(
            { mail },
            { $set: {mail: mail} }
        )
        return result
    }
}
export const ModificarUsuarioAsignaturas= async (req: any, res: any, tipoUsuario:string)=>{
    const asignaturas:string[] = req.body?.asignaturas
    const mail:string = req.body?.mail
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
    if(Array.isArray(asignaturas)&&  !asignaturas.every(e => ObjectId.isValid(e))){
        eMsg.push("asignaturas tiene algun valor no valido")
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


        const result = await db.collection(coleccion).updateOne(
            { mail },
            { $set: {asignaturas: asignaturas} }
        )
        return result
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
    }else{
        return res.status(400).json({message: 'el tipo esta mal en el codigo'})
    }

    if(!password || typeof(password)!="string"){
        return res.status(400).json({message:"password debe ser un string"})
    }
    const user = await db.collection<Usuario>(coleccion).findOne({mail})
    if(!user) {
        eMsg.push("mail debe ser un correo electronico valido")
    }else{

        const validPass = await bcrypt.compare(password, user.passwordHash)
        if(!validPass) {
            eMsg.push("contraseña incorrecta")
        }
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const token = jwt.sign({userId: user!._id?.toString(), mail: user!.mail}, SECRET,{
            expiresIn: "1h"
        })
        return token
    }

}
export const getAlumnos= async ()=>{
    const db = getDb()
    const alumnos = await  db.collection<Usuario>(ColeccionAlumnos).find().toArray()
    return alumnos;
}
export const getProfesores= async ()=>{
    const db = getDb()
    const alumnos = await  db.collection<Usuario>(ColeccionProfesores).find().toArray()
    return alumnos;
}
