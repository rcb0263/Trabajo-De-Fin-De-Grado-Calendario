import { Router } from "express"
import { getDb } from "../mongo"
import { crearUsuario, getAlumnos } from "../collections/usuarios";
import { crearAula, eliminarAula, SearchAulas } from "../collections/aulas";
import { verifyAdmin } from "../collections/privilegios";
import { verifyToken } from "../middleware/verifytoken";
const router = Router();

router.get("/",(req, res)=>{
    res.send("Se ha conectado a la ruta aulas correctamente")
})
router.post("/Crear", verifyToken, verifyAdmin, async (req, res)=>{
try {
   await crearAula(req,res)
} catch (error) {
   res.status(404).json(error)
 }
})
router.delete("/Eliminar", verifyToken, verifyAdmin, async (req, res)=>{
try {
   await eliminarAula(req,res)
} catch (error) {
   res.status(404).json(error)
 }
})
router.post("/SearchAulas", async (req, res)=>{
try {
   await SearchAulas(req,res)
} catch (error) {
   res.status(404).json(error)
 }
})

export default router;