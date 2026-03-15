import { Router } from "express"
import { asignarAlumno, asignarProfesor, crearAsignatura, crearExcepcion, crearGrupoAsignatura, crearSesion, getAsignaturas, quitarAlumno, quitarProfesor } from "../collections/asignaturas";
import { esAdmin, esPrivilegiadoGrupoAsignaturaProfesores } from "../collections/privilegios";

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

router.post("/Crear", esAdmin, async (req, res)=>{
 try {
    const result = await crearAsignatura(req,res)
    res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.post("/Grupo/Crear", esAdmin, async (req, res)=>{
 try {
   const result = await crearGrupoAsignatura(req,res)
   res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/Grupo/Horario/Crear", esAdmin, async (req, res)=>{
 try {
   const result = await crearSesion(req,res)
   res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/Grupo/Excepcion/Crear", esPrivilegiadoGrupoAsignaturaProfesores, async (req, res)=>{
 try {
   const result = await crearExcepcion(req,res)
   res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/Grupo/Profesor/Add", esAdmin, async (req, res)=>{
 try {
   const result = await asignarProfesor(req,res)
   res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/Grupo/Profesor/Remove", esAdmin, async (req, res)=>{
 try {
   const result = await quitarProfesor(req,res)
   res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/Grupo/Alumno/Add", esAdmin, async (req, res)=>{
 try {
   const result = await asignarAlumno(req,res)
   res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})
router.put("/Grupo/Alumno/Remove", esAdmin, async (req, res)=>{
 try {
   const result = await quitarAlumno(req,res)
   res.status(201).json(result)
 } catch (error) {
    res.status(404).json(error)
 }
})


export default router;