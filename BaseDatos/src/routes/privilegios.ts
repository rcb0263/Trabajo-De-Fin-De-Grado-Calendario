import { Router } from "express"
import { getDb } from "../mongo"
import { crearPrivilegiosAsignatura, crearPrivilegiosAula, crearPrivilegiosGrupoAsignatura, crearPrivilegiosUsuario } from "../collections/privilegios";
const router = Router();
const colleccion = () => {return getDb().collection('Alumnos');}

router.get("/",(req, res)=>{
    res.send("Se ha conectado a la ruta profesores correctamente")
})
router.post("/Usuarios/Crear", async (req, res)=>{
 try {
    const result = await crearPrivilegiosUsuario(req,res)
    res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.post("/Asignaturas/Crear", async (req, res)=>{
 try {
    const result = await crearPrivilegiosAsignatura(req,res)
    res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.post("/GruposAsignaturas/Crear", async (req, res)=>{
 try {
    const result = await crearPrivilegiosGrupoAsignatura(req,res)
    res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.post("/Aula/Crear", async (req, res)=>{
 try {
    const result = await crearPrivilegiosAula(req,res)
    res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
export default router;