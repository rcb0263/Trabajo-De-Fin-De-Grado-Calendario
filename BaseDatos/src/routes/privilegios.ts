import { Router } from "express"
import { getDb } from "../mongo"
import { añadirMiembroPrivilegios, crearPrivilegiosAsignatura, crearPrivilegiosAula, crearPrivilegiosGrupoAsignatura, crearPrivilegiosUsuario, ObtenerGruposPrivilegios } from "../collections/privilegios";
const router = Router();

router.get("/",(req, res)=>{
    res.send("Se ha conectado a la ruta profesores correctamente")
})
router.post("/Usuario/Crear", async (req, res)=>{
 try {
    const result = await crearPrivilegiosUsuario(req,res)
    res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.post("/Asignatura/Crear", async (req, res)=>{
 try {
    const result = await crearPrivilegiosAsignatura(req,res)
    res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.post("/GrupoAsignatura/Crear", async (req, res)=>{
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
router.put("/addMiembro", async (req, res)=>{
 try {
    const result = await añadirMiembroPrivilegios(req,res)
    res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/addMiembro", async (req, res)=>{
 try {
    const result = await añadirMiembroPrivilegios(req,res)
    res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})

router.get("/Get/Gruposprivilegiados",async (req, res)=>{
 try {
   const result = await ObtenerGruposPrivilegios(req, res)
   res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
export default router;