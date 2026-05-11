import { ObjectId } from "mongodb"
import { getDb } from "../mongo"
import { Asignatura, Aula, GrupoAsignatura, GrupoPrivilegio, Sesion, sesionAula } from "../tipos"



const ColeccionAsignaturas = "Asignaturas"
const ColeccionTeoria = "Teoria"
const ColeccionPractica = "Practica"
const ColeccionAula = "Aulas"
const ColeccionAlumnos= "Alumnos"
const ColeccionProfesores = "Profesores"
const ColeccionPrivilegios = "Privilegios"

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
    const aula:string = req.body?.aula //   PRBA202
    const eMsg:string[] = []
    const db = getDb()
    if(!aula || typeof(aula)!="string"){
        eMsg.push("nombre debe ser un string")
    }else{
        const existeAula = await db.collection(ColeccionAula).findOne({aula})
        if(!existeAula){
            eMsg.push("no existe ese aula")
        }
    }
    if(eMsg.length >0){
        return res.status(400).json({message: eMsg})
    }else{
        const db = getDb()
        const result = await db.collection(ColeccionAula).deleteOne({aula})
        return res.status(200).json(result)
    }
}
//verifyIsAdmin
export const getAula = async (req: any, res: any)=>{
    const aula:string = req.body?.aula //   PRBA202
    const id:string = req.body?.id //   PRBA202
    const eMsg:string[] = []
    const db = getDb()
    if(!aula || typeof(aula)!="string"){
        eMsg.push("aula debe ser un string")
    }else{
        const existeAula = await db.collection(ColeccionAula).findOne({aula})
        if(!existeAula){
            eMsg.push("no existe ese aula")
        }else{
            return res.status(200).json(existeAula)
        }
        
    }
    if(!id || typeof(id)!="string"){
        eMsg.push("id debe ser un string")
    }else{

        const existeAula = await db.collection(ColeccionAula).findOne({_id: new ObjectId(id)})
        if(!existeAula){
            eMsg.push("no existe ese aula")
        }else{
            const existeAula = await  db.collection<Aula>(ColeccionAula).findOne({  _id: new ObjectId(id)})
            if (!existeAula) res.status(400).json({message: 'no se existe ese aula'})
            const idsPrivilegios = existeAula!.privilegios.map((id: string) => new ObjectId(id));
            const horariosRes = await Promise.all(
            existeAula!.horarios.map(async (sesion: sesionAula) => {

                let grupoAsignatura = await db
                .collection<GrupoAsignatura>(ColeccionTeoria)
                .findOne({ _id: new ObjectId(sesion.asignatura) });

                if (!grupoAsignatura) {
                grupoAsignatura = await db
                    .collection<GrupoAsignatura>(ColeccionPractica)
                    .findOne({ _id: new ObjectId(sesion.asignatura) });
                }
                const Asignatura =  await db
                    .collection<Asignatura>(ColeccionAsignaturas)
                    .findOne({ _id: new ObjectId(grupoAsignatura?.asignatura) })
                return {
                ...sesion,
                asignatura: (Asignatura?.nombre+' Grupo '+ grupoAsignatura?.grupo)
                };
            })
            )
            const gruposPrivilegios = await db
            .collection<GrupoPrivilegio>(ColeccionPrivilegios)
            .find({ _id: { $in: idsPrivilegios } })
            .toArray();
            const result = {
            ...existeAula,
            horarios: horariosRes,
            privilegios: gruposPrivilegios,
            };
            return res.status(200).json(result);
        }
        
    }
    return res.status(400).json({message: eMsg})
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
export const SearchAulas = async (req: any, res: any)=>{
    const nombre:string = req.body?.nombre
    const eMsg:string[] = []
    const db = getDb()
    if(!nombre || typeof(nombre)!="string"){
        eMsg.push("nombre debe ser un string")
    }else{
        const aulas = await db.collection<Aula>(ColeccionAula).find(
            {aula: { $regex: nombre, $options: "i" },}
        ).toArray()
        if(aulas.length==0){
            eMsg.push("no existe ese aula")
        }{
            return res.status(200).json(aulas)
        }
    }
    return res.status(400).json({message: eMsg})
}