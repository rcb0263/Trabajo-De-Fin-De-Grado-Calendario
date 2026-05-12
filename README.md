La base de datos viene la carpeta backup,
Para usar este progrma es necesario el uso de MongoAtlasDB como proveedor. 
Para subir la base de datos a la nube de MongoAtlasDB son:
mongorestore --uri "mongodb+srv://USER:PASS@NUEVO_CLUSTER.mongodb.net/" backup/ sustituir por vuestra propia cadena
TFG/
 ├── backup/
 ├── Ejecutar aquí

.env:
SECRET=llave de encriptación
PEPPER_SECRET=encriptación secundaria
MAIL_UV=correo del usuarioverdadero

MONGO_URI_ONLINE=urlde mongo
MONGO_URI_LOCAL=url de mongo en local en caso de usarse
usuario inicial:
UV
administrador con privilegios

Lanzar el programa:
ir a la carpeta del proyecto
1 ir a la carpeta BaseDatos
2 Abrir una terminal
3 ejecutar npm run dev

4 ir a la carpeta FrontEnd
5 Abrir una terminal
6 ejecutar npm run dev

paginas:
Administrador:
tiene un menu a la iquierda para llevar a cabo las tareas. en Buscar (pagina inicial del administrador) viene un buscador para los elementos haciendo las modificaciones desde ahí es mas sencillo
Profesor: Se pueden ver los horarios, los profesores pueden hacer cambios a sus asignaturas

