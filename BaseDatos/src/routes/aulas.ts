import { Router } from "express"
import { getDb } from "../mongo"
import { crearUsuario, getAlumnos } from "../collections/usuarios";
import { crearAula, eliminarAula } from "../collections/aulas";
import { esAdmin } from "../collections/privilegios";
const router = Router();
const colleccion = () => {return getDb().collection('Alumnos');}

router.get("/",(req, res)=>{
    res.send("Se ha conectado a la ruta aulas correctamente")
})
router.post("/Crear", esAdmin, async (req, res)=>{
 try {
    const result = await crearAula(req,res)
    res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.delete("/Eliminar", esAdmin, async (req, res)=>{
 try {
    const result = await eliminarAula(req,res)
    res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})

export default router;