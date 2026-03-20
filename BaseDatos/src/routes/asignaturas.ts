import { Router } from "express"
import { asignarAlumno, asignarProfesor, crearAsignatura, crearExcepcion, crearGrupoAsignatura, crearSesion, eliminarAsignatura, eliminarExcepcion, EliminarGrupoAsignatura, eliminarSesion, getAsignaturas, ModificarAsignaturaBasico, ModificarGrupoAsignaturaBasico, quitarAlumno, quitarProfesor } from "../collections/asignaturas";
import { esPrivilegiadoGrupoAsignaturaProfesores, verifyAdmin } from "../collections/privilegios";

const router = Router();

router.get("/",(req, res)=>{
    res.send("Se ha conectado a la ruta Asignaturas correctamente")
})
router.get("/Get/Asignaturas",async (req, res)=>{
 try {
   const result = await getAsignaturas()
   res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})

router.post("/Crear",  verifyAdmin, async (req, res)=>{
 try {
    const result = await crearAsignatura(req,res)
    res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.delete("/Eliminar",  verifyAdmin, async (req, res)=>{
 try {
    const result = await eliminarAsignatura(req,res)
    res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})

router.put("/Modificar/Basico", verifyAdmin, async (req, res)=>{
 try {
    const result = await ModificarAsignaturaBasico(req,res)
    res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})

router.post("/Grupo/Crear", verifyAdmin, async (req, res)=>{
 try {
   const result = await crearGrupoAsignatura(req,res)
   res.status(201).json()
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/Grupo/Eliminar",  verifyAdmin, async (req, res)=>{
 try {
   const result = await EliminarGrupoAsignatura(req,res)
   if(result.deletedCount > 0) return res.status(201).json(result)  
   return res.status(400).json({message:"no existía ese grupo"})
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/Grupo/Modificar/Basico",  verifyAdmin, async (req, res)=>{
 try {
   const result = await ModificarGrupoAsignaturaBasico(req,res)
   if(result.modifiedCount > 0) return res.status(201).json(result)  
   return res.status(400).json({message:"no existía ese grupo"})
 } catch (error) {
    res.status(404).json(error)
 }
})

router.put("/Grupo/Horario/Crear", verifyAdmin, async (req, res)=>{
 try {
   const result = await crearSesion(req,res)
   res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/Grupo/Horario/Eliminar", verifyAdmin, async (req, res)=>{
 try {
   const result = await eliminarSesion(req,res)
   res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})

//esPrivilegiadoGrupoAsignaturaProfesores, 
router.put("/Grupo/Excepcion/Crear", async (req, res)=>{
 try {
   const result = await crearExcepcion(req,res)
   res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})

router.put("/Grupo/Excepcion/Eliminar", async (req, res)=>{
 try {
   const result = await eliminarExcepcion(req,res)
   res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})

router.put("/Grupo/Profesor/Add", verifyAdmin, async (req, res)=>{
 try {
   const result = await asignarProfesor(req,res)
   res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/Grupo/Profesor/Remove", verifyAdmin, async (req, res)=>{
 try {
   const result = await quitarProfesor(req,res)
   res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/Grupo/Alumno/Add", verifyAdmin, async (req, res)=>{
 try {
   const result = await asignarAlumno(req,res)
   res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/Grupo/Alumno/Remove", verifyAdmin, async (req, res)=>{
 try {
   const result = await quitarAlumno(req,res)
   res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})


export default router;