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

