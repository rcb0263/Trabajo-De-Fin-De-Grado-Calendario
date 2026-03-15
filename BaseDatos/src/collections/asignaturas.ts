import { ObjectId } from "mongodb"
import { getDb } from "../mongo"

import { Asignatura, Aula, Excepcion, GrupoAsignatura, GrupoPrivilegioTipo, Hora, PrivilegiosAsignatura, PrivilegiosAula, PrivilegiosGrupoAsignatura, PrivilegiosUsuario, Sesion, sesionAula, Usuario } from "../tipos"


const ColeccionAsignaturas = "Asignaturas"
const ColeccionTeoria = "Teoria"
const ColeccionPractica = "Practica"
const ColeccionAula = "Aulas"
const ColeccionAlumnos= "Alumnos"
const ColeccionProfesores = "Profesores"

export const getAsignaturas = async ()=>{
    const db = getDb()
    const asignaturas = await  db.collection<Asignatura>(ColeccionAsignaturas).find().toArray()
    return asignaturas
}
export const crearAsignatura = async (req: any, res: any)=>{
    const nombre = req.body?.nombre //   grupo: string
    const grado = req.body?.grado //   grado: string,
    const curso = req.body?.curso //   curso: number,
    const año = req.body?.año //   año: string,
    const semestre = req.body?.semestre //    semestre: 'Primero'|'Segundo',
    const eMsg:string[] = []
    const db = getDb()

    //confirmar que es unico
    if(!nombre || typeof(nombre)!="string"){
        eMsg.push("nombre debe ser un string")
    }else{
        const existeAsignatura = await db.collection(ColeccionAsignaturas).findOne({nombre: nombre, curso: curso})
        if(!existeAsignatura){
            eMsg.push("ya existe una asignatura con ese nombre para ese año ")
        }
    }
    if(!grado || typeof(grado)!="string"){
        eMsg.push("grado debe ser un string")
    }
    if(!curso ||typeof(curso)!= "number" ){
        eMsg.push("curso debe ser un numero")
    }
    if(!año || typeof(año)!="number"){
        eMsg.push("año debe ser un number")
    }
    if(!semestre ||(semestre!= 'Primero' && semestre!='Segundo')){
        eMsg.push("semestre debe ser 'Primero' o 'Segundo'")
    }
    if(eMsg.length >0){
        res.status(401).json({message: eMsg})
    }else{
        const datos:Asignatura ={
            privilegios: [],
            nombre: nombre,
            grado: grado,
            teoria: [],
            practicas: [],
            curso: curso,
            año: año,
            semestre: semestre,
            fechaDeCreacion: new Date(),
        }

        const result = await db.collection(ColeccionAsignaturas).insertOne(datos)
        return result
    }
}
export const eliminarAsignatura = async (req: any, res: any)=>{
    const nombre = req.body?.nombre //   grupo: string
    const curso = req.body?.curso //   curso: number,
    const eMsg:string[] = []
    const db = getDb()

    //confirmar que es unico
    if(!nombre || typeof(nombre)!="string"){
        eMsg.push("nombre debe ser un string")
    }else{
        const existeAsignatura = await db.collection(ColeccionAsignaturas).findOne({nombre: nombre, curso: curso})
        if(!existeAsignatura){
            eMsg.push("ya existe una asignatura con ese nombre para ese año ")
        }
    }
    if(!curso ||typeof(curso)!= "number" ){
        eMsg.push("curso debe ser un numero")
    }
    if(eMsg.length >0){
        res.status(401).json({message: eMsg})
    }else{
        const result = await db
            .collection(ColeccionAsignaturas)
            .deleteOne({nombre: nombre, curso: curso})
        return result
    }
}
export const ModificarAsignaturaBasico = async (req: any, res: any)=>{
    const cambiarNombre:boolean = req.body?.nombre //   grupo: string
    const cambiarGrado:boolean = req.body?.grado //   grado: string,
    const nombre = req.body?.nombre //   grupo: string
    const grado = req.body?.grado //   grado: string,
    const curso = req.body?.curso //   curso: number,
    const año = req.body?.año //   año: string,
    const semestre = req.body?.semestre //    semestre: 'Primero'|'Segundo',
    const db = getDb()
    const eMsg:string[] = []
    if(!(cambiarGrado || cambiarNombre || curso || año || semestre)){
        eMsg.push("debes introducir al menos un cambio")
    }
    if(!nombre || typeof(nombre)!="string"){
        eMsg.push("nombre debe ser un string")
    }else{
        const existeAsignatura = await db
        .collection(ColeccionAsignaturas)
        .findOne({nombre: nombre, curso: curso});

        if (!existeAsignatura) {
            eMsg.push("No existe esa Asignatura");
        }
    }
    if(grado && typeof(grado)!="string"){
        eMsg.push("grado debe ser un string")
    }
    if(!curso ||typeof(curso)!= "number" ){
        eMsg.push("curso debe ser un numero")
    }
    if(año && typeof(año)!="number"){
        eMsg.push("año debe ser un number")
    }
    if(semestre && (semestre!= 'Primero' && semestre!='Segundo')){
        eMsg.push("semestre debe ser 'Primero' o 'Segundo'")
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const datosModificar: any = {}
        if (cambiarNombre==true) datosModificar.nombre = nombre
        if (cambiarGrado) datosModificar.grado = grado
        if (curso) datosModificar.curso = curso
        if (año) datosModificar.año = año
        if (semestre) datosModificar.semestre = semestre


        const result = await db.collection(ColeccionAsignaturas).updateOne(
            {nombre: nombre, curso: curso},
            {$set: datosModificar }
        )
        return result
    }
}
//verifyIsAdmin
export const crearGrupoAsignatura= async (req: any, res: any)=>{ //crea el grupo y luego en routes añade el string al campo de la asignatura
    const idAsignatura:string = req.body?.idAsignatura
    const tipo: 'Teoria'|'Practica' = req.body?.tipo
    const profesor: string = req.body?.profesor
    const grupo:string = req.body?.grupo
    const horario: Sesion[] = req.body?.horario
    const eMsg:string[] = []
    let coleccion = '';
    const db = getDb()
    
    if(!tipo || typeof(tipo)!="string" || (tipo!= 'Teoria' && tipo!='Practica') ){
        eMsg.push("tipo debe ser un string")
    }
    if(tipo == 'Teoria') coleccion = ColeccionTeoria
    if(tipo == 'Practica') coleccion = ColeccionPractica

    if (!idAsignatura || typeof idAsignatura !== "string" || !ObjectId.isValid(idAsignatura)) {
        eMsg.push("idAsignatura debe ser un string de 24 caracteres hexadecimales");
    } else {
        const existeAsignatura = await db.collection(ColeccionAsignaturas).findOne({ _id: new ObjectId(idAsignatura) });
        if (!existeAsignatura) {
            eMsg.push("No se encuentra esa asignatura");
        }
    }
    //confirmar que es unico
    if(!grupo || typeof(grupo)!="string"){
        eMsg.push("grupo debe ser un string")
    }else{
        const existeGrupo = await db.collection(coleccion).countDocuments({idAsignatura: idAsignatura, grupo: grupo})
        if(existeGrupo>0){
            eMsg.push("ya existe un grupo "+grupo +" para esa asignatura")
        }
    }

    if(profesor && (typeof(profesor)!="string" || !ObjectId.isValid(profesor) ) ){
        eMsg.push("profesor debe ser un string")
    }
    
    if(tipo == 'Teoria' && horario && !(await validarNoSolape(horario))) {
        eMsg.push("horario debe ser un horario valido que no solape")
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const datos:GrupoAsignatura ={
            privilegios: [],
            tipo: tipo,
            asignatura: idAsignatura,
            profesores: [],
            grupo: grupo,
            alumnos: [],
            horarios: [],
            fechas: [],
        }
        if (profesor){
            datos.profesores.push(profesor)
        }
        if(tipo == 'Teoria'){
            if(horario){
                datos.horarios.push(...horario)
            }
            
            const result = await db.collection(ColeccionTeoria).insertOne(datos)
            const Gid = result.insertedId;
            await db.collection(ColeccionAsignaturas).updateOne(
            { _id: new ObjectId(idAsignatura) },
            { $addToSet: { teoria: Gid } }
            );

            horario.map(async (sesion)=>{
                const horarioAula: sesionAula = {
                    asignatura: idAsignatura,
                    dia: sesion.dia,
                    horaInicio: sesion.horaInicio,
                    horaFin: sesion.horaFin
                }
                await db.collection(ColeccionAula).updateOne(
                { aula: sesion.aula },
                { $addToSet: { horarios: horarioAula } }
                );
            }) 

            return res.status(201).json({message: result})
        }else{
            const result = await db.collection(ColeccionPractica).insertOne(datos)
            const Gid = result.insertedId;
            await db.collection(ColeccionAsignaturas).updateOne(
            { _id: new ObjectId(idAsignatura) },
            { $addToSet: { practicas: Gid } }
            );
            return result.insertedId.toString()
        }
    }
}
export const EliminarGrupoAsignatura = async (req: any, res: any, tipo:'Teoria' | 'Practica')=>{
    const nombre:string = req.body?.nombre
    const curso:number = req.body?.curso
    const grupo:string = req.body?.grupo
    const db = getDb()
    const eMsg:string[] = []
    if(!nombre || typeof(nombre)!="string"){
        eMsg.push("nombre debe ser un string")
    }else{
        const existeAsignatura = await db
        .collection(ColeccionAsignaturas)
        .findOne({nombre: nombre, curso: curso});

        if (!existeAsignatura) {
            eMsg.push("No existe esa Asignatura");
        }
    }
    if(!curso ||typeof(curso)!= "number" ){
        eMsg.push("curso debe ser un numero")
    }
    if(!grupo ||typeof(grupo)!= "number" ){
        eMsg.push("curso debe ser un numero")
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        if (tipo=='Teoria'){
            const result = await db.collection<Asignatura>(ColeccionAsignaturas).updateOne(
                {nombre: nombre, curso: curso},
                {$pull: {teoria: grupo}}
            )
            return result
        }else if (tipo=='Practica'){
            const result = await db.collection<Asignatura>(ColeccionAsignaturas).updateOne(
                {nombre: nombre, curso: curso},
                {$pull: {practicas: grupo}}
            )
            return result
        }
    }
}

export const ModificarGrupoAsignaturaBasico = async (req: any, res: any, tipo:'Teoria' | 'Practica')=>{
    const asignatura:string = req.body?.asignatura
    const grupo:string = req.body?.grupo
    const db = getDb()
    const eMsg:string[] = []
    let coleccion='';
    if(tipo == 'Teoria') coleccion = ColeccionTeoria
    if(tipo == 'Practica') coleccion = ColeccionPractica
    if(!asignatura || typeof(asignatura)!="string"){
        eMsg.push("nombre debe ser un string")
    }else{
        const existeGrupoAsignatura = await db.collection(coleccion).findOne({asignatura:asignatura, grupo:grupo})
        if(!existeGrupoAsignatura){
            eMsg.push("ya existe una asignatura con ese nombre para ese año ")
        }
    }
    if(!grupo ||typeof(grupo)!= "number" ){
        eMsg.push("curso debe ser un numero")
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const result = await db.collection<Asignatura>(ColeccionAsignaturas).updateOne(
                {asignatura:asignatura, grupo:grupo},
                {$pull: {grupo: grupo}}
            )
            return result
    }
}

export const crearExcepcion= async (req:any, res: any)=>{
    const idGrupo:string = req.body?.idGrupo
    const tipo = req.body?.tipo
    const excepcion:Excepcion = req.body?.excepcion
    const fecha:string = excepcion.fecha
    const aula:string = excepcion.aula
    let coleccion = '';
    const eMsg:string[] = []
    const db = getDb()
    if(tipo && typeof(tipo)=="string" ){
        if(tipo=='Teoria'){
            coleccion=ColeccionTeoria
        }else if(tipo=='Practica'){
            coleccion=ColeccionPractica
        }else{
            eMsg.push("tipo debe ser un 'Teoria' o 'Practica' ")
        }
    }else{
        eMsg.push("tipo debe ser un string")
    }
    
    if(!idGrupo || typeof(idGrupo)!="string" || !ObjectId.isValid(idGrupo) ){
        eMsg.push("idGrupo debe ser un string de 24 caracteres hexadecimales")
    }else{
        if(coleccion!=''){
            const grupo = await db.collection(coleccion).findOne({ _id: new ObjectId(idGrupo) });
            if (!grupo) {
                eMsg.push("No se encuentra ese grupo")
            }
        }
    }
    if(!aula || typeof(aula)!="string"){
        eMsg.push("aula debe ser un string")
    }
    if(!excepcion || ! await ValidarEcepcion(excepcion))
    if (!fecha || typeof fecha !== "string" ) {
        eMsg.push("fecha debe ser un string con formato dd/mm/yy")
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const get =  await db.collection(ColeccionAula).findOne(
        { aula: excepcion.aula }
        );
        const result = await db.collection(coleccion).updateOne(
            {_id: new ObjectId(idGrupo)},
            { $addToSet: { fechas: excepcion } }
        )

        const result2 = await db.collection(ColeccionAula).updateOne(
        { aula: excepcion.aula },
        { $addToSet: { exepciones: excepcion } }
        );
        return res.status(200).json(get)
    }

}
export const eliminarExcepcion= async (req:any, res: any)=>{
    const idGrupo:string = req.body?.idGrupo
    const tipo = req.body?.tipo
    const excepcion:Excepcion = req.body?.excepcion
    const fecha:string = excepcion.fecha
    const aula:string = excepcion.aula
    let coleccion = '';
    const eMsg:string[] = []
    const db = getDb()
    if(tipo && typeof(tipo)=="string" ){
        if(tipo=='Teoria'){
            coleccion=ColeccionTeoria
        }else if(tipo=='Practica'){
            coleccion=ColeccionPractica
        }else{
            eMsg.push("tipo debe ser un 'Teoria' o 'Practica' ")
        }
    }else{
        eMsg.push("tipo debe ser un string")
    }
    
    if(!idGrupo || typeof(idGrupo)!="string" || !ObjectId.isValid(idGrupo) ){
        eMsg.push("idGrupo debe ser un string de 24 caracteres hexadecimales")
    }else{
        if(coleccion!=''){
            const grupo = await db.collection(coleccion).findOne({ _id: new ObjectId(idGrupo) });
            if (!grupo) {
                eMsg.push("No se encuentra ese grupo")
            }
        }
    }
    if(!excepcion || ! await ValidarEcepcion(excepcion)){
        eMsg.push("excepcion debe ser una Excepción valida que no solape")
    }
    if(!aula || typeof(aula)!="string"){
        eMsg.push("aula debe ser un string")
    }
    if (!fecha || typeof fecha !== "string" ) {
        eMsg.push("fecha debe ser un string con formato dd/mm/yy")
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const result = await db.collection<GrupoAsignatura>(coleccion).updateOne(
            {_id: new ObjectId(idGrupo)},
            { $pull: { fechas: excepcion } }
        )

        const result2 = await db.collection<Aula>(ColeccionAula).updateOne(
        { aula: excepcion.aula },
        { $pull: { exepciones: excepcion } }
        )
        return res.status(200).json(result)
    }
}

//verifyIsAdmin or verify privilegios datosBasicos=true
export const crearSesion= async (req: any, res: any)=>{ //crea el grupo y luego en routes añade el string al campo de la asignatura
    const idGrupo:string = req.body?.idGrupo
    const sesion:Sesion = req.body?.sesion
    const eMsg:string[] = []
    const db = getDb()
    if(!idGrupo || typeof(idGrupo)!="string" || !ObjectId.isValid(idGrupo) ){
        eMsg.push("idGrupo debe ser un string de 24 caracteres hexadecimales")
    }else{
        const asignatura = await db.collection(ColeccionTeoria).findOne({ _id: new ObjectId(idGrupo) });
        if (!asignatura) {
            eMsg.push("No se encuentra esa asignatura")
        }
    }
    if(!sesion || !validarSesion(sesion) ){
        eMsg.push("sesiones debe ser un array con al menos un elemento")
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const result = await db
        .collection(ColeccionTeoria)
        .updateOne(
            {_id: new ObjectId(idGrupo)},
            { $addToSet: { horarios: sesion } }
        )
        return res.status(200).json(result)
    }
}
export const eliminarSesion= async (req: any, res: any)=>{ //crea el grupo y luego en routes añade el string al campo de la asignatura
    const idGrupo:string = req.body?.idGrupo
    const sesion:Sesion = req.body?.sesion
    const eMsg:string[] = []
    const db = getDb()
    if(!idGrupo || typeof(idGrupo)!="string" || !ObjectId.isValid(idGrupo) ){
        eMsg.push("idGrupo debe ser un string de 24 caracteres hexadecimales")
    }else{
        const asignatura = await db.collection(ColeccionTeoria).findOne({ _id: new ObjectId(idGrupo) });
        if (!asignatura) {
            eMsg.push("No se encuentra esa asignatura")
        }
    }
    if(!sesion || await validarEliminarSesion(sesion) ){//es una sesión valida que solapa
        eMsg.push("sesiones debe ser un array con al menos un elemento")
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const result = await db
        .collection<GrupoAsignatura>(ColeccionTeoria)
        .updateOne(
            {_id: new ObjectId(idGrupo)},
            { $pull: { horarios: sesion } }
        )
        return res.status(200).json(result)
    }
}
//verifyIsAdmin or verify privilegios datosAvanzados=true
export const asignarProfesor= async (req:any, res: any)=>{
    const idGrupo:string = req.body?.idGrupo
    const idProfesor :string = req.body?.idProfesor
    const tipo = req.body?.tipo
    let coleccion = '';
    const eMsg:string[] = []
    const db = getDb()
    if(tipo && typeof(tipo)=="string" ){
        if(tipo=='Teoria'){
            coleccion=ColeccionTeoria
        }else if(tipo=='Practica'){
            coleccion=ColeccionPractica
        }else{
            eMsg.push("tipo debe ser un 'Teoria' o 'Practica' ")
        }
    }else{
        eMsg.push("tipo debe ser un string")
    }

    if(!idProfesor || typeof(idProfesor)!="string" || !ObjectId.isValid(idProfesor) ){
        eMsg.push("idProfesor debe ser un string de 24 caracteres hexadecimales")
    }else{
        const profesor = await db.collection(ColeccionProfesores).findOne({ _id: new ObjectId(idProfesor) });
        if (!profesor) {
            eMsg.push("No se encuentra ese profesor")
        }
    }

    if(!idGrupo || typeof(idGrupo)!="string" || !ObjectId.isValid(idGrupo) ){
        eMsg.push("idGrupo debe ser un string de 24 caracteres hexadecimales")
    }else{
        if(coleccion!=''){
            const grupo = await db.collection(coleccion).findOne({ _id: new ObjectId(idGrupo) });
            if (!grupo) {
                eMsg.push("No se encuentra ese grupo")
            }
        }
    }

    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const result = await db
        .collection(coleccion)
        .updateOne(
            {_id: new ObjectId(idGrupo)},
            { $addToSet: { profesores: idProfesor } }
        )
        const result2 = await db
        .collection(ColeccionProfesores)
        .updateOne(
            {_id: new ObjectId(idProfesor)},
            { $addToSet: { asignaturas: idGrupo } }
        )
        return res.status(200).json(
            {result1: result, result2: result2})
    }

}
//verifyIsAdmin or verify privilegios datosAvanzados=true
export const quitarProfesor= async (req:any, res: any)=>{
    const idGrupo:string = req.body?.idGrupo
    const idProfesor :string = req.body?.idProfesor
    const tipo = req.body?.tipo
    let coleccion = '';
    const eMsg:string[] = []
    const db = getDb()
    if(tipo && typeof(tipo)=="string" ){
        if(tipo=='Teoria'){
            coleccion=ColeccionTeoria
        }else if(tipo=='Practica'){
            coleccion=ColeccionPractica
        }else{
            eMsg.push("tipo debe ser un 'Teoria' o 'Practica' ")
        }
    }else{
        eMsg.push("tipo debe ser un string")
    }

    if(!idProfesor || typeof(idProfesor)!="string" || !ObjectId.isValid(idProfesor) ){
        eMsg.push("idProfesor debe ser un string de 24 caracteres hexadecimales")
    }else{
        const profesor = await db.collection(ColeccionProfesores).findOne({ _id: new ObjectId(idProfesor) });
        if (!profesor) {
            eMsg.push("No se encuentra ese profesor")
        }
    }

    if(!idGrupo || typeof(idGrupo)!="string" || !ObjectId.isValid(idGrupo) ){
        eMsg.push("idGrupo debe ser un string de 24 caracteres hexadecimales")
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        if(coleccion!=''){
            const grupo = await db.collection(coleccion).findOne({ _id: new ObjectId(idGrupo) });
            if (!grupo) {
                eMsg.push("No se encuentra ese grupo")
                return res.status(400).json({message: eMsg})
            }else{
                const result = await db.collection<GrupoAsignatura>(coleccion).updateOne(
                    { _id: new ObjectId(idGrupo) },
                    { $pull: { profesores: idProfesor } }
                )
                const result2 = await db.collection<Usuario>(ColeccionProfesores).updateOne(
                    { _id: new ObjectId(idProfesor) },
                    { $pull: { asignaturas: idGrupo } }
                )

                if (result.modifiedCount === 0) {
                    return res.status(400).json({
                        message: "El profesor no está asignado a este grupo"
                    })
                }else if (result2.modifiedCount === 0) {
                    return res.status(400).json({
                        message: "El grupo no está asignada a este profesor"
                    })
                }
                return res.status(200).json(
                {
                    message: "Profesor eliminado correctamente",
                    result1: result, 
                    result2: result2
                })
            }
        }
    }

}

//verifyIsAdmin or verifyIsAlumno mover a usuarios
export const asignarAlumno= async (req:any, res: any)=>{
    const idGrupo:string = req.body?.idGrupo
    const idAlumno :string = req.body?.idAlumno
    const tipo = req.body?.tipo
    let coleccion = '';
    const eMsg:string[] = []
    const db = getDb()
    if(tipo && typeof(tipo)=="string" ){
        if(tipo=='Teoria'){
            coleccion=ColeccionTeoria
        }else if(tipo=='Practica'){
            coleccion=ColeccionPractica
        }else{
            eMsg.push("tipo debe ser un 'Teoria' o 'Practica' ")
        }
    }else{
        eMsg.push("tipo debe ser un string")
    }

    if(!idAlumno || typeof(idAlumno)!="string" || !ObjectId.isValid(idAlumno) ){
        eMsg.push("idAlumno debe ser un string de 24 caracteres hexadecimales")
    }else{
        const alumno = await db.collection(ColeccionAlumnos).findOne({ _id: new ObjectId(idAlumno) });
        if (!alumno) {
            eMsg.push("No se encuentra ese alumno")
        }
    }

    if(!idGrupo || typeof(idGrupo)!="string" || !ObjectId.isValid(idGrupo) ){
        eMsg.push("idGrupo debe ser un string de 24 caracteres hexadecimales")
    }else{
        if(coleccion!=''){
            const grupo = await db.collection(coleccion).findOne({ _id: new ObjectId(idGrupo) });
            if (!grupo) {
                eMsg.push("No se encuentra ese grupo")
            }
        }
    }

    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const result = await db
        .collection(coleccion)
        .updateOne(
            {_id: new ObjectId(idGrupo)},
            { $addToSet: { alumnos: idAlumno } }
        )
        const result2 = await db
        .collection(ColeccionAlumnos)
        .updateOne(
            {_id: new ObjectId(idAlumno)},
            { $addToSet: { asignaturas: idGrupo } }
        )
        return res.status(200).json(
            {result1: result, result2: result2})
    }

}
//verifyIsAdmin or verifyIsAlumno mover a usuarios
export const quitarAlumno= async (req:any, res: any)=>{
    const idGrupo:string = req.body?.idGrupo
    const idAlumno :string = req.body?.idAlumno
    const tipo = req.body?.tipo
    let coleccion = '';
    const eMsg:string[] = []
    const db = getDb()
    if(tipo && typeof(tipo)=="string" ){
        if(tipo=='Teoria'){
            coleccion=ColeccionTeoria
        }else if(tipo=='Practica'){
            coleccion=ColeccionPractica
        }else{
            eMsg.push("tipo debe ser un 'Teoria' o 'Practica' ")
        }
    }else{
        eMsg.push("tipo debe ser un string")
    }

    if(!idAlumno || typeof(idAlumno)!="string" || !ObjectId.isValid(idAlumno) ){
        eMsg.push("idAlumno debe ser un string de 24 caracteres hexadecimales")
    }else{
        const alumno = await db.collection(ColeccionAlumnos).findOne({ _id: new ObjectId(idAlumno) });
        if (!alumno) {
            eMsg.push("No se encuentra ese alumno")
        }
    }

    if(!idGrupo || typeof(idGrupo)!="string" || !ObjectId.isValid(idGrupo) ){
        eMsg.push("idGrupo debe ser un string de 24 caracteres hexadecimales")
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        if(coleccion!=''){
            const grupo = await db.collection(coleccion).findOne({ _id: new ObjectId(idGrupo) });
            if (!grupo) {
                eMsg.push("No se encuentra ese grupo")
                return res.status(400).json({message: eMsg})
            }else{
                const result = await db.collection<GrupoAsignatura>(coleccion).updateOne(
                    { _id: new ObjectId(idGrupo) },
                    { $pull: { alumnos: idAlumno } }
                )
                const result2 = await db.collection<Usuario>(ColeccionAlumnos).updateOne(
                    { _id: new ObjectId(idAlumno) },
                    { $pull: { asignaturas: idGrupo } }
                )

                if (result.modifiedCount === 0) {
                    return res.status(400).json({
                        message: "El alumno no está asignado a este grupo"
                    })
                }else if (result2.modifiedCount === 0) {
                    return res.status(400).json({
                        message: "El grupo no está asignada a este alumno"
                    })
                }
                return res.status(200).json(
                {
                    message: "alumno eliminado correctamente",
                    result1: result, 
                    result2: result2
                })
            }
        }
    }

}

const validarNoSolape= (sesiones: Sesion[]): boolean => {
    return sesiones.every(async (sesion, i)=>{
        const interno = sesiones.every((h, j) => {
            if (j==i) return true
            if (h.dia !== sesion.dia) return true;

            if(sesion.horaFin.hora< h.horaInicio.hora
            || h.horaFin.hora < sesion.horaInicio.hora
            || sesion.horaFin.hora == h.horaInicio.hora &&sesion.horaFin.minuto <= h.horaInicio.minuto
            || sesion.horaInicio.hora == h.horaFin.hora && sesion.horaInicio.minuto >= h.horaFin.minuto
            ){
                return true
            }

            return false
        });
        //if (!interno) return false
        await validarSesion(sesion)
    })
}


const validarEliminarSesion = async (sesion: Sesion): Promise<boolean> => {
    const diasValidos = new Set(['L','M','X','J','V']);
    const db = getDb()
    

    // Validar día
    if (!diasValidos.has(sesion.dia)) return false;

    // Validar horas (formato + orden)
    if (!validarHorario(sesion.horaInicio, sesion.horaFin)) return false;

    // Validar aula
    if (!sesion.aula ) return false;
    const aula = await db.collection<Aula>(ColeccionAula)
        .findOne({ aula: sesion.aula });
    if (!aula) return false;

    // Validar disponibilidad
    if (AulaDisponibleSesiones(aula, sesion)) return false;

    return true;
}
const validarSesion = async (sesion: Sesion): Promise<boolean> => {
    const diasValidos = new Set(['L','M','X','J','V']);
    const db = getDb()
    

    // Validar día
    if (!diasValidos.has(sesion.dia)) return false;

    // Validar horas (formato + orden)
    if (!validarHorario(sesion.horaInicio, sesion.horaFin)) return false;

    // Validar aula
    if (!sesion.aula ) return false;
    const aula = await db.collection<Aula>(ColeccionAula)
        .findOne({ aula: sesion.aula });
    if (!aula) return false;

    // Validar disponibilidad
    if (!AulaDisponibleSesiones(aula, sesion)) return false;

    return true;

}

const validarHorario = (horaInicio: Hora, horaFin: Hora) =>{ // B.Fin[11:00] A.Inicio[10:30] -> B.hora<A.hora no -> B.hora==A.hora no -> false
    if (validarHora(horaInicio) && validarHora(horaFin) && (horaInicio.hora<horaFin.hora || (horaInicio.hora==horaFin.hora && horaInicio.minuto<horaFin.minuto))){
        return true
    }
    return false
}
const validarHora = (hora:Hora): boolean => {

    if((hora.minuto != 0 && hora.minuto != 30 ) || !(hora.hora >= 8 && hora.hora  < 22)){
        return false
    }
    return true;
}
const AulaDisponibleSesiones = (aula: Aula, sesionNueva: Sesion)=>{ // A[10:00, 11:00] B[10:30, 11:30]
    const disponible = aula.horarios.every(h => {

        if (h.dia !== sesionNueva.dia) return true;

        if(validarHorario(sesionNueva.horaFin, h.horaInicio) 
            || validarHorario(h.horaFin, sesionNueva.horaInicio) 
            || sesionNueva.horaFin.hora == h.horaInicio.hora &&sesionNueva.horaFin.minuto == h.horaInicio.minuto
            ||sesionNueva.horaInicio.hora == h.horaFin.hora && sesionNueva.horaInicio.minuto == h.horaFin.minuto
        ){
            return true
        }

        return false
    });

    return disponible
}
const AulaDisponibleExcepciones = (aula: Aula, excepcionNueva: Excepcion)=>{ // A[10:00, 11:00] B[10:30, 11:30]

    const disponible = aula.exepciones.every(h => {
        if (h.fecha !== excepcionNueva.fecha) return true;

        if(validarHorario(excepcionNueva.horaFin, h.horaInicio) 
            || validarHorario(h.horaFin, excepcionNueva.horaInicio) 
            || excepcionNueva.horaFin.hora == h.horaInicio.hora && excepcionNueva.horaFin.minuto == h.horaInicio.minuto
            || excepcionNueva.horaInicio.hora == h.horaFin.hora && excepcionNueva.horaInicio.minuto == h.horaFin.minuto
        ){
            return true
        }

        return false
    });

    return disponible
}
const ValidarEcepcion = async (excepcion: Excepcion): Promise<boolean> => {
    const [dd, mm, yyyy] = excepcion.fecha.split('/').map(Number);
    const date = new Date(yyyy, mm-1, dd )
    let dia :  'L' | 'M' | 'X' | 'J' | 'V';
    switch (date.getDay()){
        case 1:
            dia='L'
            break;
        case 2:
            dia='M'
            break;
        case 3:
            dia='X'
            break;
        case 4:
            dia='J'
            break;
        case 5:
            dia='V'
            break;
        default:
            return false;
    }

    // Validar horas (formato + orden)
    if (!validarHorario(excepcion.horaInicio, excepcion.horaFin)) return false;
    // Validar aula
    if (!excepcion.aula ) return false;
    const db = getDb()
    const aula = await db.collection<Aula>(ColeccionAula).findOne({ aula: excepcion.aula });
    if (!aula) return false;

    const sesion: Sesion = {
        aula: excepcion.aula,
        dia: dia,
        horaInicio: excepcion.horaInicio,
        horaFin: excepcion.horaFin
    }
    
    // Validar disponibilidad
    if (!AulaDisponibleSesiones(aula, sesion) || !AulaDisponibleExcepciones(aula, excepcion)) return false;

    return true;
}