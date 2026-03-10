import { Router } from "express"
import { getDb } from "../mongo"
import { crearUsuario, getProfesores, logIn } from "../collections/usuarios";
import { AuthRequest, verifyToken } from "../middleware/verifytoken";
const router = Router();
const colleccion = () => {return getDb().collection('Alumnos');}

router.get("/",(req, res)=>{
    res.send("Se ha conectado a la ruta profesores correctamente")
})
router.post("/Crear", async (req, res)=>{
 try {
    const result = await crearUsuario(req,res, 'Profesor')
    res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.get("/Login", async (req, res)=>{
 try {
    const result = await logIn(req,res, 'Profesor')
    res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.get("/GetUserIdFromToken", verifyToken, async (req: AuthRequest, res)=>{
 try {
   const result = req.user
   res.status(201).json(result)
 } catch (error) {
    res.status(409).json(error)
 }
})
export default router;