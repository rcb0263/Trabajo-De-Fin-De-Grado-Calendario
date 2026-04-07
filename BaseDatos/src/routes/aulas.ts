import { Router } from "express"
import { getDb } from "../mongo"
import { crearUsuario, getAlumnos } from "../collections/usuarios";
import { crearAula, eliminarAula } from "../collections/aulas";
import { esAdmin } from "../collections/privilegios";
const router = Router();

router.get("/",(req, res)=>{
    res.send("Se ha conectado a la ruta aulas correctamente")
})
router.post("/Crear", esAdmin, async (req, res)=>{
try {
   await crearAula(req,res)
} catch (error) {
   res.status(404).json(error)
 }
})
router.delete("/Eliminar", esAdmin, async (req, res)=>{
try {
   await eliminarAula(req,res)
} catch (error) {
   res.status(404).json(error)
 }
})

export default router;