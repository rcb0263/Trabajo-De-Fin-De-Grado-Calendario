import { Router } from "express"
import { getDb } from "../mongo"
import { crearUsuario, eliminarUsuario, getAlumnos, getAsignaturas, getUsuario, logIn, SearchUsuario } from "../collections/usuarios";
import { verifyAdmin } from "../collections/privilegios";
import { verifyToken } from "../middleware/verifytoken";
const router = Router();
const colleccion = () => {return getDb().collection('Alumnos');}

router.get("/",(req, res)=>{
    res.send("Se ha conectado a la ruta alumnos correctamente")
})
router.post("/Crear", verifyAdmin, async (req, res)=>{
 try {
    await crearUsuario(req,res, 'Alumno')
 } catch (error) {
    res.status(404).json(error)
 }
})
router.delete("/Eliminar", verifyToken, verifyAdmin, async (req, res)=>{
 try {
   console.log("ENTRA DELETE");
   await eliminarUsuario(req,res, 'Alumno')

 } catch (error) {
    res.status(404).json(error)
 }
})
router.get("/GetAsignaturas",  async (req, res)=>{
 try {
   await getAsignaturas(req,res, 'Alumno')
 } catch (error) {
    res.status(401).json(error)
 }
})
router.post("/Login", async (req, res)=>{
 try {
    const result = await logIn(req,res, 'Alumno')
 } catch (error) {
    res.status(404).json(error)
 }
})
router.get("/Get",async (req, res)=>{
 try {
   await getAlumnos()
 } catch (error) {
    res.status(409).json(error)
 }
})
router.post("/SearchAlumno", async (req, res)=>{
 try {
   await SearchUsuario(req,res, 'Alumno')
 } catch (error) {
    res.status(404).json(error)
 }
})
router.post("/getAlumno", async (req, res)=>{
 try {
   await getUsuario(req,res, 'Alumno')
 } catch (error) {
    res.status(404).json(error)
 }
})
export default router;