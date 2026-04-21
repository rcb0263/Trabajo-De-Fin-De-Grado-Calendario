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

export const SearchAsignaturas = async (req: any, res: any)=>{
    const nombre = req.body?.nombre //   grupo: string
    const grado = req.body?.grado //   grupo: string
    const curso = req.body?.curso //   curso: number,
    const eMsg:string[] = []
    const db = getDb()

    //confirmar que es unico
    if(!curso || typeof(curso)!="number"){
        eMsg.push("curso debe ser un number")
    }
    if(!nombre || typeof(nombre)!="string"){
        eMsg.push("nombre debe ser un string")
    }
    if(!grado || typeof(grado)!="number"){
        eMsg.push("grado debe ser un string")
    }
    
    if(!!grado && !!nombre && !!curso){
        const existeAsignatura = await db.collection(ColeccionAsignaturas)
        .find({
        nombre: { $regex: nombre, $options: "i" },
        curso: curso, 
        grado: { $regex: grado, $options: "i" }}).toArray()
        return res.status(201).json(existeAsignatura)
    }
    return res.status(400).json({mensaje: eMsg})
}
//Funciona
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
        if(existeAsignatura){
            eMsg.push("ya existe una asignatura con ese nombre para ese curso")
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
        return res.status(400).json({message: eMsg})
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
        return res.status(201).json(result)
    }
}
//Funciona
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
            eMsg.push("No existe una asignatura con ese nombre para ese año ")
        }
    }
    if(!curso ||typeof(curso)!= "number" ){
        eMsg.push("curso debe ser un numero")
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const result = await db
            .collection(ColeccionAsignaturas)
            .deleteOne({nombre: nombre, curso: curso})
        return res.status(201).json(result)
    }
}
//Funciona
export const ModificarAsignaturaBasico = async (req: any, res: any)=>{
    const nuevoNombre:boolean = req.body?.nuevoNombre //   grupo: string
    const nuevoCurso:boolean = req.body?.nuevoCurso //   grado: string,
    const nombre = req.body?.nombre //   grupo: string
    const grado = req.body?.grado //   grado: string,
    const curso = req.body?.curso //   curso: number,
    const año = req.body?.año //   año: string,
    const semestre = req.body?.semestre //    semestre: 'Primero'|'Segundo',
    const db = getDb()
    const eMsg:string[] = []
    if(!(nuevoCurso || nuevoNombre || grado || año || semestre)){
        eMsg.push("debes introducir al menos un cambio")
    }
    if(!curso ||typeof(curso)!= "number" ){
        eMsg.push("curso debe ser un numero")
    }
    if(grado && typeof(grado)!="string"){
        eMsg.push("grado debe ser un string")
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
        if (nuevoNombre) datosModificar.nombre = nuevoNombre
        if (nuevoCurso) datosModificar.curso = nuevoCurso
        if (grado) datosModificar.grado = grado
        if (año) datosModificar.año = año
        if (semestre) datosModificar.semestre = semestre

        const result = await db.collection(ColeccionAsignaturas).updateOne(
            {nombre: nombre, curso: curso},
            {$set: datosModificar }
        )
        return res.status(201).json(result)
    }
}

//Funciona
export const crearGrupoAsignatura= async (req: any, res: any)=>{ //crea el grupo y luego en routes añade el string al campo de la asignatura
    const nombre: string = req.body?.nombre;
    const curso: number= req.body?.curso;
    const tipo: 'Teoria'|'Practica' = req.body?.tipo
    const profesor: string = req.body?.profesor
    const grupo:string = req.body?.grupo
    const horario: Sesion[] = req.body?.horario
    const eMsg:string[] = []
    let coleccion = '';
    let idAsignatura='';
    const db = getDb()
    
    if (
    tipo !== "Teoria" &&
    tipo !== "Practica"
    ) {
    eMsg.push("tipo debe ser 'Teoria' o 'Practica'");
    }
    if(tipo == 'Teoria') coleccion = ColeccionTeoria
    if(tipo == 'Practica') coleccion = ColeccionPractica

    if(!nombre || typeof(nombre)!="string"){
        eMsg.push("nombre debe ser un string")
    }else 
    if(!curso ||typeof(curso)!= "number" ){
        eMsg.push("curso debe ser un numero")
    }else{
        const existeAsignatura = await db.collection(ColeccionAsignaturas).findOne({nombre: nombre, curso: curso})
        if (!existeAsignatura) {
            eMsg.push("No se encuentra esa asignatura");
        }else{
            idAsignatura=String(existeAsignatura._id);
        }
    }
    //confirmar que es unico
    if(!grupo || typeof(grupo)!="string"){
        eMsg.push("grupo debe ser un string")
    }else if(coleccion!=''){
        const existeGrupo = await db.collection(coleccion).findOne({asignatura: idAsignatura, grupo: grupo})
        if(existeGrupo){
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
            const Gid = String(result.insertedId);
            await db.collection(ColeccionAsignaturas).updateOne(
            { _id: new ObjectId(idAsignatura) },
            { $addToSet: { teoria: Gid } }
            );

            await Promise.all(horario.map(async (sesion)=>{
                const horarioAula: sesionAula = {
                    asignatura: Gid,
                    dia: sesion.dia,
                    horaInicio: sesion.horaInicio,
                    horaFin: sesion.horaFin
                }
                await db.collection(ColeccionAula).updateOne(
                { aula: sesion.aula },
                { $addToSet: { horarios: horarioAula } }
                );
            }) )

            return res.status(201).json({message: result})
        }else{
            const result = await db.collection(ColeccionPractica).insertOne(datos)
            const Gid = result.insertedId;
            await db.collection(ColeccionAsignaturas).updateOne(
            { _id: new ObjectId(idAsignatura) },
            { $addToSet: { practicas: Gid } }
            );
            return res.status(201).json(result.insertedId.toString())
        }
    }
}
//Funciona
export const EliminarGrupoAsignatura = async (req: any, res: any)=>{
    const asignatura:string = req.body?.asignatura
    const grupo:string = req.body?.grupo
    const tipo: 'Teoria'|'Practica' = req.body?.tipo
    const db = getDb()
    const eMsg:string[] = []
    if(!asignatura || typeof(asignatura)!="string"){
        eMsg.push("asignatura debe ser un string")
    }else{
        const existeAsignatura = await db
        .collection(ColeccionAsignaturas)
        .findOne({_id: new ObjectId(asignatura)});
        if (!existeAsignatura) {
            eMsg.push("No existe esa Asignatura");
        }
    }
    if(!tipo || typeof(tipo)!="string" || (tipo!= 'Teoria' && tipo!='Practica') ){
        eMsg.push("tipo debe ser un string")
    }
    if(!grupo ||typeof(grupo)!= "string" ){
        eMsg.push("grupo debe ser un string")
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        if (tipo=='Teoria'){
            const existeGrupo = await db.collection<GrupoAsignatura>(ColeccionTeoria).findOne({asignatura: asignatura, grupo: grupo})
            if(!existeGrupo){
                return res.status(400).json({message: "No existe ese grupo"})
            }
            const result = await db.collection<Asignatura>(ColeccionAsignaturas).updateOne(
                {_id: new ObjectId(asignatura)},
                {$pull: {teoria: String(existeGrupo._id)}}
            )
            const result2 = await db.collection<GrupoAsignatura>(ColeccionTeoria).deleteOne({_id: existeGrupo._id})
            return res.status(201).json(result2)
        }else if (tipo=='Practica'){
            const existeGrupo = await db.collection<GrupoAsignatura>(ColeccionPractica).findOne({asignatura: asignatura, grupo: grupo})
            
            if(!existeGrupo){
                return res.status(400).json({message: "No existe ese grupo"})
            }
            const result = await db.collection<Asignatura>(ColeccionAsignaturas).updateOne(
                {_id: new ObjectId(asignatura)},
                {$pull: {practicas:  String(existeGrupo._id)}}
            )
            const result2 = await db.collection<GrupoAsignatura>(ColeccionPractica).deleteOne({_id: existeGrupo._id})

            return res.status(201).json(result2)
        }
    }
}
//Funciona
export const ModificarGrupoAsignaturaBasico = async (req: any, res: any)=>{
    const asignatura:string = req.body?.asignatura
    const grupo:string = req.body?.grupo
    const nuevoGrupo:string = req.body?.nuevoGrupo
    const tipo: 'Teoria'|'Practica' = req.body?.tipo
    const db = getDb()
    const eMsg:string[] = []
    let coleccion='';
    if(!tipo || typeof(tipo)!="string" || (tipo!= 'Teoria' && tipo!='Practica') ){
        eMsg.push("tipo debe ser un string")
    }else if(tipo == 'Teoria') {
        coleccion = ColeccionTeoria
    }else{
        coleccion = ColeccionPractica
    }
    if(!asignatura || typeof(asignatura)!="string"){
        eMsg.push("asignatura debe ser un string")
    }else if(coleccion != ''){
        const existeGrupoAsignatura = await db.collection(coleccion).findOne({asignatura:asignatura, grupo:grupo})
        if(!existeGrupoAsignatura){
            eMsg.push("no existe una asignatura con ese nombre para ese año ")
        }
    }
    if(!grupo ||typeof(grupo)!= "string" ){
        eMsg.push("grupo debe ser un string")
    }
    if(!nuevoGrupo ||typeof(nuevoGrupo)!= "string" ){
        eMsg.push("nuevoGrupo debe ser un string")
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const result = await db.collection<GrupoAsignatura>(coleccion).updateOne(
                {asignatura:asignatura, grupo:grupo},
                {$set: { grupo: nuevoGrupo } }
            )
            return res.status(201).json(result)
    }
}
//Funciona
export const crearExcepcion= async (req:any, res: any)=>{
    const idGrupo:string = req.body?.idGrupo
    const tipo = req.body?.tipo
    const excepcion:Excepcion = req.body?.excepcion
    const fecha:string = excepcion?.fecha
    const aula:string = excepcion?.aula
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
    if(!excepcion || await ValidarEcepcion(excepcion)!=1){
        eMsg.push("excepcion debe ser valida (fecha, aula, horaInicio, horaFin)")
    }
    if (!fecha || typeof fecha !== "string" ) {
        eMsg.push("fecha debe ser un string con formato dd/mm/yy")
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const result = await db.collection(coleccion).updateOne(
            {_id: new ObjectId(idGrupo)},
            { $addToSet: { fechas: excepcion } }
        )

        const result2 = await db.collection(ColeccionAula).updateOne(
        { aula: excepcion.aula },
        { $addToSet: { exepciones: excepcion } }
        );
        const get =  await db.collection(ColeccionAula).findOne(
        { aula: excepcion.aula }
        );

        return res.status(200).json(get)
    }

}
//Funciona
export const eliminarExcepcion= async (req:any, res: any)=>{
    const idGrupo:string = req.body?.idGrupo
    const tipo = req.body?.tipo
    const excepcion:Excepcion = req.body?.excepcion
    const fecha:string = excepcion?.fecha
    const aula:string = excepcion?.aula
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
    if(!excepcion || await ValidarEcepcion(excepcion)!=2){
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

//Funciona
export const crearSesion= async (req: any, res: any)=>{ //crea el grupo y luego en routes añade el string al campo de la asignatura
    const idGrupo:string = req.body?.idGrupo
    const sesion:Sesion = req.body?.sesion
    const eMsg:string[] = []
    const db = getDb()
    if(!idGrupo || typeof(idGrupo)!="string" || !ObjectId.isValid(idGrupo) ){
        eMsg.push("idGrupo debe ser un string de 24 caracteres hexadecimales")
    }else{
        const grupo = await db.collection<GrupoAsignatura>(ColeccionTeoria).findOne({ _id: new ObjectId(idGrupo) });
        if (!grupo) {
            eMsg.push("No se encuentra ese grupo")
        }else{
            if(! noSolapeInterno([...grupo.horarios, sesion])){
                eMsg.push("sesion no debe solapar con otros horarios del grupo")
            }
        }
    }
    if(!sesion || !(await validarSesion(sesion)) ){
        eMsg.push("sesion debe tener los campos {aula, dia, horaInicio, horaFin}")
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

        const horarioAula: sesionAula = {
                asignatura: idGrupo,
                dia: sesion.dia,
                horaInicio: sesion.horaInicio,
                horaFin: sesion.horaFin
        }
        await db.collection(ColeccionAula).updateOne(
            { aula: sesion.aula },
            { $addToSet: { horarios: horarioAula } }
        );
        return res.status(200).json(result)
    }
}
//Funciona
export const eliminarSesion= async (req: any, res: any)=>{ //crea el grupo y luego en routes añade el string al campo de la asignatura
    const idGrupo:string = req.body?.idGrupo
    const sesion:Sesion = req.body?.sesion
    const eMsg:string[] = []
    const db = getDb()
    if(!idGrupo || typeof(idGrupo)!="string" || !ObjectId.isValid(idGrupo) ){
        eMsg.push("idGrupo debe ser un string de 24 caracteres hexadecimales")
    }else{
        const grupo = await db.collection<GrupoAsignatura>(ColeccionTeoria).findOne({ _id: new ObjectId(idGrupo) });
        if (!grupo) {
            eMsg.push("No se encuentra ese grupo")
        }else{
            if(noSolapeInterno([...grupo.horarios, sesion])){
                eMsg.push("sesion debe solapar con otros horarios del grupo")
            }
        }
    }
    if(!sesion || await validarEliminarSesion(sesion) ){//es una sesión valida que solapa
        eMsg.push("sesion debe ser una sola sesión")
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const horarioAula: sesionAula = {
            asignatura: idGrupo,
            dia: sesion.dia,
            horaInicio: sesion.horaInicio,
            horaFin: sesion.horaFin
        }
        const result2 = await db.collection<Aula>(ColeccionAula).updateOne(
            { aula: sesion.aula },
            { $pull: { horarios: horarioAula } }
        );
        if(result2.modifiedCount==0){
            return res.status(200).json({message: 'no se pudo eliminar el horario', result2})
        }
        const result = await db
        .collection<GrupoAsignatura>(ColeccionTeoria)
        .updateOne(
            {_id: new ObjectId(idGrupo)},
            { $pull: { horarios: sesion } }
        )
        return res.status(200).json(result)
    }
}

//Funciona verifyIsAdmin or verify privilegios datosAvanzados=true
export const asignarProfesor= async (req:any, res: any)=>{
    const grupo: string = req.body?.grupo
    const asignatura: string = req.body?.asignatura
    const mail :string = req.body?.mail
    const tipo = req.body?.tipo
    let coleccion = '';
    let idGrupo = '';
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

    if(!mail || typeof(mail)!="string" ){
        eMsg.push("mail debe ser un string")
    }else{
        const profesor = await db.collection(ColeccionProfesores).findOne({ mail: mail });
        if (!profesor) {
            eMsg.push("No se encuentra ese profesor")
        }
    }

    if(!asignatura || !grupo || typeof(grupo)!="string" || typeof(asignatura)!="string" ){
        eMsg.push("asignatura y grupo son necesarios para encontrar el grupo")
    }else{
        if(coleccion!=''){
            const existeGrupo = await db.collection<GrupoAsignatura>(coleccion).findOne({asignatura: asignatura, grupo: grupo});
            idGrupo = String(existeGrupo?._id)
            if (!existeGrupo) {
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
            {asignatura: asignatura, grupo: grupo},
            { $addToSet: { profesores: mail } }
        )
        const result2 = await db
        .collection(ColeccionProfesores)
        .updateOne(
            {mail: mail},
            { $addToSet: { asignaturas: idGrupo } }
        )
        return res.status(200).json(
            {result1: result, result2: result2})
    }

}
//Funciona verifyIsAdmin or verify privilegios datosAvanzados=true
export const quitarProfesor= async (req:any, res: any)=>{
    const grupo: string = req.body?.grupo
    const asignatura: string = req.body?.asignatura
    const mail :string = req.body?.mail
    const tipo = req.body?.tipo
    let idGrupo = '';
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

    if(!mail || typeof(mail)!="string"){
        eMsg.push("mail debe ser un string valido")
    }else{
        const profesor = await db.collection<Usuario>(ColeccionProfesores).findOne({ mail: mail });
        if (!profesor) {
            eMsg.push("No se encuentra ese profesor")
        }
    }

    if(!asignatura || !grupo || typeof(grupo)!="string" || typeof(asignatura)!="string" ){
        eMsg.push("asignatura y grupo son necesarios para encontrar el grupo")
    }else{
        if(coleccion!=''){
            const existeGrupo = await db.collection<GrupoAsignatura>(coleccion).findOne({asignatura: asignatura, grupo: grupo});
            idGrupo = String(existeGrupo?._id)
            if (!grupo) {
                eMsg.push("No se encuentra ese grupo")
            }
        }
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{

        const result = await db.collection<GrupoAsignatura>(coleccion).updateOne(
            { _id: new ObjectId(idGrupo) },
            { $pull: { profesores: mail } }
        )
        const result2 = await db.collection<Usuario>(ColeccionProfesores).updateOne(
            { mail: mail },
            { $pull: { asignaturas: idGrupo } }
        )
        return res.status(200).json({
            message: "Profesor eliminado correctamente",
            result1: result, 
            result2: result2
        })
    }
}

//Funciona verifyIsAdmin or verifyIsAlumno mover a usuarios
export const asignarAlumno= async (req:any, res: any)=>{
    const grupo: string = req.body?.grupo
    const asignatura: string = req.body?.asignatura
    const mail :string = req.body?.mail
    const tipo = req.body?.tipo
    let coleccion = '';
    let idGrupo = '';
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

    if(!mail || typeof(mail)!="string" || !ObjectId.isValid(mail) ){
        eMsg.push("mmail debe ser un string hexadecimales")
    }else{
        const alumno = await db.collection(ColeccionAlumnos).findOne({ mail: mail });
        if (!alumno) {
            eMsg.push("No se encuentra ese alumno")
        }
    }

    if(!asignatura || !grupo || typeof(grupo)!="string" || typeof(asignatura)!="string" ){
        eMsg.push("asignatura y grupo son necesarios para encontrar el grupo")
    }else{
        if(coleccion!=''){
            const existeGrupo = await db.collection<GrupoAsignatura>(coleccion).findOne({asignatura: asignatura, grupo: grupo});
            idGrupo = String(existeGrupo?._id)
            if (!grupo) {
                eMsg.push("No se encuentra ese grupo")
            }
        }
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const result = await db
        .collection<GrupoAsignatura>(coleccion)
        .updateOne(
            {asignatura: asignatura, grupo: grupo},
            { $addToSet: { alumnos: mail } }
        )
        const result2 = await db
        .collection<Usuario>(ColeccionAlumnos)
        .updateOne(
            {mail: mail},
            { $addToSet: { asignaturas: idGrupo } }
        )
        return res.status(200).json(
            {result1: result, result2: result2})
    }

}
//Funciona verifyIsAdmin or verifyIsAlumno mover a usuarios
export const quitarAlumno= async (req:any, res: any)=>{
    const grupo: string = req.body?.grupo
    const asignatura: string = req.body?.asignatura
    const mail :string = req.body?.mail
    const tipo = req.body?.tipo
    let idGrupo = '';
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

    if(!mail || typeof(mail)!="string" || !ObjectId.isValid(mail) ){
        eMsg.push("mmail debe ser un string hexadecimales")
    }else{
        const alumno = await db.collection(ColeccionAlumnos).findOne({ mail: mail });
        if (!alumno) {
            eMsg.push("No se encuentra ese alumno")
        }
    }

    if(!asignatura || !grupo || typeof(grupo)!="string" || typeof(asignatura)!="string" ){
        eMsg.push("asignatura y grupo son necesarios para encontrar el grupo")
    }else{
        if(coleccion!=''){
            const existeGrupo = await db.collection<GrupoAsignatura>(coleccion).findOne({asignatura: asignatura, grupo: grupo});
            idGrupo = String(existeGrupo?._id)
            if (!grupo) {
                eMsg.push("No se encuentra ese grupo")
            }
        }
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{

        const result = await db.collection<GrupoAsignatura>(coleccion).updateOne(
            { _id: new ObjectId(idGrupo) },
            { $pull: { alumnos: mail } }
        )
        const result2 = await db.collection<Usuario>(ColeccionAlumnos).updateOne(
            { mail: mail },
            { $pull: { asignaturas: idGrupo } }
        )
        return res.status(200).json({
            message: "Alumno eliminado correctamente",
            result1: result, 
            result2: result2
        })
    }
}

const validarNoSolape = async (sesiones: Sesion[]): Promise<boolean> => {

    // Validar solape interno
    if (!noSolapeInterno(sesiones)) {
        return false;
    }

    // Validar cada sesión (async)
    const resultados = await Promise.all(
        sesiones.map(s => validarSesion(s))
    );

    return resultados.every(r => r === true);
};

const noSolapeInterno = (sesiones: Sesion[]): boolean => {
    return sesiones.every((sesion, i) => {
        return sesiones.every((h, j) => {
            if (i === j) return true;
            if (h.dia !== sesion.dia) return true;

            return (
                sesion.horaFin.hora < h.horaInicio.hora ||
                h.horaFin.hora < sesion.horaInicio.hora ||
                (sesion.horaFin.hora === h.horaInicio.hora && sesion.horaFin.minuto <= h.horaInicio.minuto) ||
                (sesion.horaInicio.hora === h.horaFin.hora && sesion.horaInicio.minuto >= h.horaFin.minuto)
            );
        });
    });
};

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
    const result = aula.horarios.some(horario=>{
        if(horario.dia  == sesion.dia
        && horario.horaFin  == sesion.horaFin
        && horario.horaInicio  == sesion.horaInicio
        ){
            return true
        }
        return false
    } )
    if(!result){return false}
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
    if (!AulaDisponibleSesiones(aula, sesion)){
        return false;
    }else{
        return true
    }

    

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
const ValidarEcepcion = async (excepcion: Excepcion): Promise<number> => {
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
            return 0;
    }

    // Validar horas (formato + orden)
    if (!validarHorario(excepcion.horaInicio, excepcion.horaFin)) return 0;
    // Validar aula
    if (!excepcion.aula ) return 0;
    const db = getDb()
    const aula = await db.collection<Aula>(ColeccionAula).findOne({ aula: excepcion.aula });
    if (!aula) return 0;

    const sesion: Sesion = {
        aula: excepcion.aula,
        dia: dia,
        horaInicio: excepcion.horaInicio,
        horaFin: excepcion.horaFin
    }
    
    // Validar disponibilidad
    if (!AulaDisponibleSesiones(aula, sesion) || !AulaDisponibleExcepciones(aula, excepcion)) return 2;

    return 1;
}