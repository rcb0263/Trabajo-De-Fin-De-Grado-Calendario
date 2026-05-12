import { ObjectId } from "mongodb"
import { getDb } from "../mongo"
import { Administrador, Asignatura, FrontHorarioAsignatura, GrupoAsignatura, GrupoPrivilegio, Usuario } from "../tipos"


const ColeccionPrivilegios = "Privilegios"
const ColeccionAlumnos= "Alumnos"
const ColeccionProfesores = "Profesores"
const ColeccionTeoria = "Teoria"
const ColeccionPractica = "Practica"
const ColeccionAsignaturas = "Asignaturas"
const ColeccionAdmin = "Admin"


export const eliminarUsuario = async (req: any, res: any, tipoUsuario:string)=>{
    const mail:string = req.body?.mail //   grupo: string
    const id:string = req.body?.id //   grupo: string
    
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
        if(!id){
            eMsg.push("mail debe ser un correo electronico valido")
        }else{
            const existeMail = await db
            .collection(coleccion)
            .findOne({ _id: new ObjectId(id) });

            if (!existeMail) {
                eMsg.push("No existe un "+ tipoUsuario +" con ese correo electrónico");
            }
        }
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
        if(mail){
            const result = await db.collection(coleccion).deleteOne({mail: mail})
            return res.status(201).json(result)
        }else{
            const result = await db.collection(coleccion).deleteOne({ _id: new ObjectId(id) })
            return res.status(201).json(result)
        }
        
        
    }
}


export const SearchUsuario = async (req: any,res: any,  tipoUsuario:string)=>{
    const mail = req.body?.mail //   grupo: string
    const eMsg:string[] = []
    const db = getDb()
    let coleccion = ''
    if(tipoUsuario=='Alumno'){
        coleccion=ColeccionAlumnos
    }else if(tipoUsuario=='Profesor'){
        coleccion=ColeccionProfesores
    }else{
        return res.status(400).json({message: 'el tipo no es valido'})
    }
    if(!mail || typeof(mail)!="string"){
        eMsg.push("mail debe ser un string")
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
       const usuarios = await db
        .collection(coleccion)
        .find({
            mail : { $regex: mail, $options: "i" }
        }).toArray();
        return res.status(201).json(usuarios)
    }
}

export const getUsuario= async  (req: any,res: any,  tipoUsuario:string)=>{
    const id:string = req.body?.id
    const mail:string = req.body?.mail
    const db = getDb()
    const eMsg:string[] = []

    const coleccion = (tipoUsuario=='Alumno'? ColeccionAlumnos: tipoUsuario=='Profesor'? ColeccionProfesores:'')
    if(!id|| !ObjectId){
        eMsg.push('ese id no es valido')
    }

    if(eMsg.length>0) {
        if(!mail|| !ObjectId){
            eMsg.push('ese mail no es valido')
        }
        const usuario = await  db.collection<Usuario>(coleccion).findOne({  mail: mail})
        if(!usuario){
            return (res.status(400).json({message: eMsg}))
        }else{
            return res.status(200).json(usuario)
        }
    }
    const usuario = await  db.collection<Usuario>(coleccion).findOne({  _id: new ObjectId(id)})
    const idsPrivilegios = usuario!.privilegios.map((id: string) => new ObjectId(id));
    const gruposPrivilegios = await db
    .collection<GrupoPrivilegio>(ColeccionPrivilegios)
    .find({ _id: { $in: idsPrivilegios } })
    .toArray();
    const result = {
    ...usuario,
    privilegios: gruposPrivilegios,
    };
    return usuario?res.status(200).json(result):res.status(400).json({message: 'no se ha encontrado ese usuario'});
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
