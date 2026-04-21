import { Router } from "express"
import { asignarAlumno, asignarProfesor, crearAsignatura, crearExcepcion, crearGrupoAsignatura, crearSesion, eliminarAsignatura, eliminarExcepcion, EliminarGrupoAsignatura, eliminarSesion, getAsignaturas, ModificarAsignaturaBasico, ModificarGrupoAsignaturaBasico, quitarAlumno, quitarProfesor, SearchAsignaturas } from "../collections/asignaturas";
import { esPrivilegiadoGrupoAsignaturaProfesores, verifyAdmin } from "../collections/privilegios";

const router = Router();

router.get("/",(req, res)=>{
    res.send("Se ha conectado a la ruta Asignaturas correctamente")
})
router.get("/Get",async (req, res)=>{
 try {
   const result = await getAsignaturas()
   res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.post("/SearchAsignaturas", async (req, res)=>{
 try {
   await SearchAsignaturas(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})

router.post("/Crear", async (req, res)=>{
 try {
   await crearAsignatura(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.delete("/Eliminar",  verifyAdmin, async (req, res)=>{
 try {
    await eliminarAsignatura(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})

router.put("/Modificar/Basico", verifyAdmin, async (req, res)=>{
 try {
    await ModificarAsignaturaBasico(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})

router.post("/Grupo/Crear",  async (req, res)=>{
 try {
   await crearGrupoAsignatura(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/Grupo/Eliminar",  verifyAdmin, async (req, res)=>{
 try {
   await EliminarGrupoAsignatura(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/Grupo/Modificar/Basico",  verifyAdmin, async (req, res)=>{
 try {
   await ModificarGrupoAsignaturaBasico(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})

router.put("/Grupo/Horario/Crear", verifyAdmin, async (req, res)=>{
 try {
   await crearSesion(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/Grupo/Horario/Eliminar", verifyAdmin, async (req, res)=>{
 try {
   await eliminarSesion(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})

//esPrivilegiadoGrupoAsignaturaProfesores, 
router.put("/Grupo/Excepcion/Crear", async (req, res)=>{
 try {
   await crearExcepcion(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})

router.put("/Grupo/Excepcion/Eliminar", async (req, res)=>{
 try {
   await eliminarExcepcion(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})

router.put("/Grupo/Profesor/Add", verifyAdmin, async (req, res)=>{
 try {
   await asignarProfesor(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/Grupo/Profesor/Remove", verifyAdmin, async (req, res)=>{
 try {
   await quitarProfesor(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/Grupo/Alumno/Add", verifyAdmin, async (req, res)=>{
 try {
   await asignarAlumno(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/Grupo/Alumno/Remove", verifyAdmin, async (req, res)=>{
 try {
   await quitarAlumno(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})


export default router;