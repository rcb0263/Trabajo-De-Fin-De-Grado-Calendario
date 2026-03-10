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
        const existeAula = await db.collection(ColeccionAula).countDocuments({aula: nombre})
        if(existeAula>0){
            eMsg.push("ya existe ese aula")
        }
    }
    if(eMsg.length >0){
        res.status(400).json({message: eMsg})
    }else{
        const db = getDb()
        console.log(db)
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
        return result
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
        res.status(400).json({message: eMsg})
    }else{
        const db = getDb()
        console.log(db)
        const aula = await  db.collection<Aula>(ColeccionAula).findOne({aula: nombre})
        if(aula){
            res.status(400).json({message: 'El aula ya existe'})
        }

        const result = await db.collection(ColeccionAula).deleteOne({aula: nombre})
        return result
    }
}