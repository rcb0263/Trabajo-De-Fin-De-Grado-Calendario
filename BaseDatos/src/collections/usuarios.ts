import { ObjectId } from "mongodb"
import { getDb } from "../mongo"
import { Administrador, Asignatura, FrontHorarioAsignatura, GrupoAsignatura, Usuario } from "../tipos"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


const ColeccionAlumnos= "Alumnos"
const ColeccionProfesores = "Profesores"
const ColeccionTeoria = "Teoria"
const ColeccionPractica = "Practica"
const ColeccionAsignaturas = "Asignaturas"
const ColeccionAdmin = "Admin"
const ColeccionTrue = "UV"
const SECRET = process.env.SECRET||""; 

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
export const CrearTrueUser = async (req: any, res: any)=>{
    const db = getDb()

    const passEncripta = await bcrypt.hash("CalNe123",10)
    const datos:Administrador ={
        nombre: "CalNe",
        mail: "calne@mail.com",
        passwordHash: passEncripta,
        fechaDeCreacion: new Date()
    }
    const result = await db.collection(ColeccionTrue).insertOne(datos)
    return res.status(201).json(result)
}
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
        const passEncripta = await bcrypt.hash(password,10)
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
        return res.status(201).json(result)
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
export const ModificarUsuarioAvanzados = async (req: any, res: any, tipoUsuario:string)=>{
    const mail:string = req.body?.mail
    const nuevoMail:string = req.body?.nuevoMail
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
        .collection<Usuario>(coleccion)
        .findOne({ mail });

        if (!existeMail) {
            eMsg.push("No existe un "+ tipoUsuario +" con ese correo electrónico");
        }
    }
    if(!nuevoMail || typeof(nuevoMail)!="string"||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nuevoMail)){
        eMsg.push("nuevoMail debe ser un correo electronico valido")
    }else{
        const existeMail = await db
        .collection<Usuario>(coleccion)
        .findOne({ mail: nuevoMail });

        if (existeMail) {
            eMsg.push("Ya existe un "+ tipoUsuario +" con ese correo electrónico");
        }
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const result = await db.collection<Usuario>(coleccion).updateOne(
            { mail },
            { $set: {mail: nuevoMail} }
        )
        return res.status(201).json(result)
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
        return res.status(201).json(result)
    }
}

export const getAsignaturas = async (req: any, res: any, tipoUsuario:string) => {
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
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const existeMail = await db
        .collection<Usuario>(coleccion)
        .findOne({ mail });
        if (!existeMail) {
            return res.status(400).json({message: "No existe ese "+ tipoUsuario })
        }
        const asignaturasIds = existeMail.asignaturas;
        const Asignaturas = await Promise.all(
            asignaturasIds.map(async (e)=>{
                const res = await db
                .collection<GrupoAsignatura>(ColeccionTeoria)
                .findOne({_id: new ObjectId(e)})
                if (res){
                    return res as GrupoAsignatura
                }
                const res2 = await db
                .collection<GrupoAsignatura>(ColeccionPractica)
                .findOne({_id: new ObjectId(e)})
                return res2 as GrupoAsignatura
            })
        )
        return res.status(201).json({Asignaturas})
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

        const validPass = await bcrypt.compare(password, user.passwordHash)
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
export const getHorarios = async (req: any, res: any, tipoUsuario:string) => {
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
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        
        const existeMail = await db
        .collection<Usuario>(coleccion)
        .findOne({ mail });
        if (!existeMail) {
            return res.status(400).json({message: "No existe ese "+ tipoUsuario })
        }
        const asignaturasIds = existeMail.asignaturas;
        
        const asignaturasConHorario: FrontHorarioAsignatura[] = await Promise.all(
            asignaturasIds.map(async (e) => {
                const id = new ObjectId(e);

                let grupo = await db.collection<GrupoAsignatura>(ColeccionTeoria).findOne({ _id: id });

                if (!grupo) {
                    grupo = await db.collection<GrupoAsignatura>(ColeccionPractica).findOne({ _id: id });
                }

                if (!grupo) {
                    return {
                        nombre: 'N/A',
                        horario: [],
                    };
                }
                const asignaturaDoc = await db
                    .collection<Asignatura>(ColeccionAsignaturas).findOne({ _id: new ObjectId(grupo.asignatura)});
                return {
                    nombre: `${asignaturaDoc?.nombre} ${grupo.tipo} ${grupo.grupo}`,
                    horario: grupo.horarios ?? [],
                };
            })
            );
        return res.status(201).json({asignaturasConHorario})
    }
}
