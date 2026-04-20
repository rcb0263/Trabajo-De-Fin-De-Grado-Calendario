import { ObjectId } from "mongodb"
import { getDb } from "../mongo"
import { Aula } from "../tipos"



const ColeccionAsignaturas = "Asignaturas"
const ColeccionTeoria = "Teoria"
const ColeccionPractica = "Practica"
const ColeccionAula = "Aulas"
const ColeccionAlumnos= "Alumnos"
const ColeccionProfesores = "Profesores"

//verifyIsAdmin
export const crearAula = async (req: any, res: any)=>{
    const nombre:string = req.body?.nombre //   PRBA202
    const eMsg:string[] = []
    const db = getDb()
    if(!nombre || typeof(nombre)!="string"){
        eMsg.push("nombre debe ser un string")
    }else{
        const existeAula = await db.collection(ColeccionAula).findOne({aula: nombre})
        if(existeAula){
            eMsg.push("ya existe ese aula")
        }
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const db = getDb()
        const aula = await  db.collection<Aula>(ColeccionAula).findOne({aula: nombre})
        if(aula){
            res.status(400).json({message: 'El aula ya existe'})
        }
        const datos:Aula ={
            privilegios: [],
            aula: nombre,
            horarios: [],
            exepciones: []
        }
        const result = await db.collection(ColeccionAula).insertOne(datos)
        return res.status(200).json(result)
    }
}
//verifyIsAdmin
export const eliminarAula = async (req: any, res: any)=>{
    const nombre:string = req.body?.nombre //   PRBA202
    const eMsg:string[] = []
    const db = getDb()
    if(!nombre || typeof(nombre)!="string"){
        eMsg.push("nombre debe ser un string")
    }else{
        const existeAula = await db.collection(ColeccionAula).findOne({aula: nombre})
        if(!existeAula){
            eMsg.push("no existe ese aula")
        }
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const db = getDb()
        const aula = await  db.collection<Aula>(ColeccionAula).findOne({aula: nombre})
        if(aula){
            res.status(400).json({message: 'El aula ya existe'})
        }

        const result = await db.collection(ColeccionAula).deleteOne({aula: nombre})
        return res.status(200).json(result)
    }
}
//verifyIsAdmin
export const modificarAula = async (req: any, res: any)=>{
    const nombre:string = req.body?.nombre
    const nuevoNombre:string = req.body?.nuevoNombre
    const eMsg:string[] = []
    const db = getDb()
    if(!nombre || typeof(nombre)!="string"){
        eMsg.push("nombre debe ser un string")
    }else{
        const existeAula = await db.collection(ColeccionAula).findOne({aula: nombre})
        if(!existeAula){
            eMsg.push("no existe ese aula")
        }
    }
    if(!nuevoNombre || typeof(nuevoNombre)!="string"){
        eMsg.push("nuevoNombre debe ser un string")
    }else{
        const existeAula = await db.collection(ColeccionAula).findOne({aula: nuevoNombre})
        if(!existeAula){
            eMsg.push("ya existe un aula con el nuevoNombre")
        }
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const db = getDb()
        const aula = await  db.collection<Aula>(ColeccionAula).findOne({aula: nombre})
        if(aula){
            res.status(400).json({message: 'El aula ya existe'})
        }

        const result = await db.collection(ColeccionAula).updateOne(
            {aula: nombre},
            {aula: nuevoNombre}
        )
        return res.status(200).json(result)
    }
}