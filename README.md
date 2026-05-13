La base de datos se almacena en la carpeta /backup,
Para esta aplicación es necesario el uso de MongoDB Atlas como proveedor. 

Para subir la base de datos a la nube de MongoDB Atlas hay que realizar de dos formas diferentes:

OPCIÓN 1:
mongorestore --uri "mongodb+srv://USER:PASS@NUEVO_CLUSTER.mongodb.net/" backup/ (sustituir por tu propia cadena)
TFG/
 ├── backup/
 ├── Ejecutar aquí

OPCIÓN 2:
Crear tu propia base de datos (ver documentación Mongo%db Atlas)

.env:

SECRET=llave de encriptación
PEPPER_SECRET=encriptación secundaria
MAIL_UV=correo del usuarioverdadero

MONGO_URI_ONLINE=urlde mongo (base de datos online)
MONGO_URI_LOCAL=url de mongo en local

si se usa la base de datos de backup (Opción 1):
SECRET=passsupersecret
PEPPER_SECRET=lapepamemato
MAIL_UV=calne@mail.com
usuario admin por defecto: 
  calne@mailcom
  contraseña:
  calne123

Si se crea una base de datos desde cero (Opción 2)
en /BaseDatos/src/routes/privilegios.ts
router.post("/CrearAdministrador", verifyToken, verifyAdmin,  async (req, res)=>{
 try {
    await CrearAdmin(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})

quitar  'verifyToken, verifyAdmin,'
router.post("/CrearAdministrador", async (req, res)=>{
 try {
    await CrearAdmin(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})

lanzar una llamada por API: POST localhost:3000/privilegios/Admin/Crear, body:
{
    "nombre": "nombre del usuario",
    "mail": "correo del usuario",
    "password": "contraseña"
}

depues volver a añadir 'verifyToken, verifyAdmin,'
router.post("/CrearAdministrador", verifyToken, verifyAdmin,  async (req, res)=>{
 try {
    await CrearAdmin(req,res)
 } catch (error) {
    res.status(404).json(error)
 }
})
//lanzar una llamada por API: POST localhost:3000/privilegios/Admin/Crear, body: {
    "nombre":"nombre del grupo de amdinistradors a crear"
}
una vez creado el grupo comentar este enpoint:
router.post("/Admin/Crear", async (req, res)=>{
 try {
   await esTrueUser(req, res);
   await crearAdminGrupo(req, res);   
 } catch (error) {
    res.status(404).json(error)
 }
})

Lanzar el programa:
 0 ir a la carpeta del proyecto
 1 ir a la carpeta /BaseDatos
 2 Abrir una terminal
 3 npm install
 4 ejecutar npm run dev

 5 ir a la carpeta /FrontEnd
 6 Abrir una terminal
 7 npm install
 8 ejecutar npm run dev

paginas:
Administrador:
/admin/
tiene un menu a la iquierda para llevar a cabo las tareas.

Buscador de asignaturas, aulas, usuarios
Menu a la izquierda:
Buscar,
Crear asignaturas, aulas, usuarios, grupos de asignaturas,
Crear Grupos de privilegios
asignar privilegios
Eliminar usuarios
añadir privilegios
es necesario eliminar el contenido de un objeto antes de eliminar el objeto por problemas de sincronia, 
esto se planea resolver en una release antes del 25 de mayo 2026
/admin/crear/cambiarprivilegios
asignr y quitar privilegios

/admin/crear/crearasignatura
crear una asignatura

/admin/crear/crearaula
crear un aula

/admin/crear/creareliminaradministrador
crear un administrador y añadir o eliminarlo del grupo de privilegios de administradores

/admin/crear/creargrupoasignatura
crear un grupo asignatura

/admin/crear/crearprivilegios
crear un grupo de privilegios

/admin/crear/crearusuario
crear un usuario


/admin/asignaturas
ver la asignatura, 
ver/crear/eliminar sus privilegios
ver/crear/eliminar sus grupos

hacer click en los grupos de teoria o practica, te lleva a /asignaturas/**/[Teoria || Practica]
/admin/asignaturas/**/[Teoria || Practica]
ver el grupo de asignatura,
ver/crear/eliminar sus privilegios
ver/crear/eliminar sus horarios/sesiones
añadir/quitar profesores y alumnos

/admin/usuarios
ver el usuario, 
ver/crear/eliminar privilegios para el usuario
ver sus asignaturas

/admin/aula
ver el aula, 
ver/crear/eliminar privilegios para el aula


Usuarios y Profesor: visualizar los horarios, los profesores realizar cambios a sus asignaturas

La aplicación es actualmente funcional, su principal mejora de este momento a la entrega final es depuración y mayor facilidad para interactuar con la API










