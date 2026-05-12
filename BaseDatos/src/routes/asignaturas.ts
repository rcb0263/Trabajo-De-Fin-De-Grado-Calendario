import { Router } from "express"
import { asignarAlumno, asignarProfesor, crearAsignatura, crearExcepcion, crearGrupoAsignatura, crearSesion, eliminarAsignatura, eliminarExcepcion, EliminarGrupoAsignatura, eliminarSesion, GetAsignatura, getAsignaturas, GetGrupoAsignatura, GetGrupoAsignaturaSinTipo, ModificarAsignaturaBasico, ModificarGrupoAsignaturaBasico, quitarAlumno, quitarProfesor, SearchAsignaturas } from "../collections/asignaturas";
import { esPrivilegiadoGrupoAsignaturaProfesores, verifyAdmin } from "../collections/privilegios";
import { verifyToken } from "../middleware/verifytoken";

const router = Router();

router.get("/",(req, res)=>{
    res.send("Se ha conectado a la ruta Asignaturas correctamente")
})
router.get("/Get", verifyToken, async (req, res)=>{
 try {
   const result = await getAsignaturas()
   res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.post("/SearchAsignaturas", verifyToken, async (req, res)=>{
 try {
   await SearchAsignaturas(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})

router.post("/getAsignatura", verifyToken, async (req, res)=>{
 try {
   await GetAsignatura(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.post("/getGrupoAsignatura", verifyToken, async (req, res)=>{
 try {
   await GetGrupoAsignatura(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.post("/getGrupoAsignaturaSinTipo", verifyToken, async (req, res)=>{
 try {
   await GetGrupoAsignaturaSinTipo(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})

router.post("/Crear", verifyToken,  verifyAdmin,async (req, res)=>{
 try {
   await crearAsignatura(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.delete("/Eliminar", verifyToken, verifyAdmin, async (req, res)=>{
 try {
   await eliminarAsignatura(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})

router.put("/Modificar/Basico",verifyToken, verifyAdmin, async (req, res)=>{
 try {
    await ModificarAsignaturaBasico(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})

router.post("/Grupo/Crear", verifyToken, async (req, res)=>{
 try {
   await crearGrupoAsignatura(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/Grupo/Eliminar", verifyToken, verifyAdmin, async (req, res)=>{
 try {
   await EliminarGrupoAsignatura(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/Grupo/Modificar/Basico", verifyToken, verifyAdmin, async (req, res)=>{
 try {
   await ModificarGrupoAsignaturaBasico(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})

router.put("/Grupo/Horario/Crear", verifyToken, verifyAdmin, async (req, res)=>{
 try {
   await crearSesion(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/Grupo/Horario/Eliminar", verifyToken, verifyAdmin, async (req, res)=>{
 try {
   await eliminarSesion(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})

router.put("/Grupo/Excepcion/Crear",verifyToken, esPrivilegiadoGrupoAsignaturaProfesores, async (req, res)=>{
 try {
   await crearExcepcion(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})

router.put("/Grupo/Excepcion/Eliminar", verifyToken, esPrivilegiadoGrupoAsignaturaProfesores, async (req, res)=>{
 try {
   await eliminarExcepcion(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})

router.put("/Grupo/Profesor/Add", verifyToken, verifyAdmin, async (req, res)=>{
 try {
   await asignarProfesor(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/Grupo/Profesor/Remove", verifyToken, verifyAdmin, async (req, res)=>{
 try {
   await quitarProfesor(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/Grupo/Alumno/Add", verifyToken, verifyAdmin, async (req, res)=>{
 try {
   await asignarAlumno(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/Grupo/Alumno/Remove", verifyToken, verifyAdmin, async (req, res)=>{
 try {
   await quitarAlumno(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})


export default router;