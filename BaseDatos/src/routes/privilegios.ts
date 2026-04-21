import { Router } from "express"
import { getDb } from "../mongo"
import { añadirAdminPrivilegios, añadirMiembroPrivilegios, crearAdminGrupo, crearPrivilegiosAsignatura, crearPrivilegiosAula, crearPrivilegiosGrupoAsignatura, crearPrivilegiosUsuario, eliminarMiembroPrivilegios, esAdmin, ObtenerGruposPrivilegios } from "../collections/privilegios";
import { CrearAdmin, CrearTrueUser, logIn } from "../collections/usuarios";
const router = Router();

router.get("/",(req, res)=>{
    res.send("Se ha conectado a la ruta profesores correctamente")
})
router.post("/Login", async (req, res)=>{
 try {
   await logIn(req,res, 'Administrador')
 } catch (error) {
   res.status(404).json(error)
 }
})
router.post("/CrearAdministrador", async (req, res)=>{
 try {
    await CrearAdmin(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.post("/CrearTrueUser", ()=>{return false} , async (req, res)=>{
 try {
    await CrearTrueUser(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.post("/Admin/Crear", async (req, res)=>{
 try {
    await crearAdminGrupo(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/addAdmin", async (req, res)=>{
 try {
   await añadirAdminPrivilegios(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
}) 
router.post("/Usuario/Crear", esAdmin, async (req, res)=>{
 try {
    await crearPrivilegiosUsuario(req,res)
    
 } catch (error) {
    res.status(404).json(error)
 }
})
router.post("/Asignatura/Crear", esAdmin, async (req, res)=>{
 try {
    await crearPrivilegiosAsignatura(req,res)
    
 } catch (error) {
    res.status(404).json(error)
 }
})
router.post("/GrupoAsignatura/Crear", esAdmin, async (req, res)=>{
 try {
    await crearPrivilegiosGrupoAsignatura(req,res)
    
 } catch (error) {
    res.status(404).json(error)
 }
})
router.post("/Aula/Crear", esAdmin, async (req, res)=>{
 try {
    await crearPrivilegiosAula(req,res)
    
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/addMiembro", esAdmin, async (req, res)=>{
 try {
    await añadirMiembroPrivilegios(req,res)
    
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/eliminarMiembro", esAdmin, async (req, res)=>{
 try {
    await eliminarMiembroPrivilegios(req,res)
    
 } catch (error) {
    res.status(404).json(error)
 }
})

router.get("/Get/Gruposprivilegiados",  esAdmin, async (req, res)=>{
 try {
   const result = await ObtenerGruposPrivilegios(req, res)
   res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
export default router;