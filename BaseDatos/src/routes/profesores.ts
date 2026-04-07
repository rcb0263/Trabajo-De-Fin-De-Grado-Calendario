import { Router } from "express"
import { crearUsuario, eliminarUsuario, getAsignaturas, getProfesores, logIn } from "../collections/usuarios";
import { AuthRequest, verifyToken } from "../middleware/verifytoken";
import { esAdmin } from "../collections/privilegios";
const router = Router();

router.get("/",(req, res)=>{
    res.send("Se ha conectado a la ruta profesores correctamente")
})
router.post("/Crear", async (req, res)=>{
 try {
    await crearUsuario(req,res, 'Profesor')
 } catch (error) {
    res.status(404).json(error)
 }
})
router.delete("/Eliminar",esAdmin, async (req, res)=>{
 try {
   await eliminarUsuario(req,res, 'Alumno')

 } catch (error) {
    res.status(404).json(error)
 }
})
router.get("/GetAsignaturas",  async (req: AuthRequest, res)=>{
 try {
   await getAsignaturas(req,res, 'Profesor')
 } catch (error) {
    res.status(401).json(error)
 }
})
router.get("/Login", async (req, res)=>{
 try {
    const result = await logIn(req,res, 'Profesor')
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