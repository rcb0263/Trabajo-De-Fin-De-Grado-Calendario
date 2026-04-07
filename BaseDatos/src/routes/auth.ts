import { Router } from "express"
import { getDb } from "../mongo"
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Usuario } from "../tipos";

const router = Router();
const colleccion = () => {return getDb().collection<User>('placeholder');}

const SECRET = process.env.SECRET||""; 

type User = {
    mail: string,
    _id?: ObjectId,
    username?: string,
    password: string
}

type JetPayload={
    id: string,
    mail: string
}

router.get("/",(req, res)=>{
    res.send("Se ha conectado a la ruta auth correctamente")
})

router.post("/register", async (req,res)=>{
    try {
        const {mail, password} = req.body as {mail: string, password:string}
        const users = colleccion()
        const exists = await users.findOne({mail: mail})
        if(exists){
            return res.status(400).json({message:" Ya existe"})
        }

        const passEncripta = await bcrypt.hash(password,10)
        const datos: Usuario = {
            nombre: "",
            mail,
            passwordHash: passEncripta,
            asignaturas: [],
            fechaDeCreacion: new Date()
            
        }
        await users.insertOne({mail, password: passEncripta})

        res.status(201).json({message: "Usuario creado correctamente"})
    }catch (error) {
        res.status(500).json({message:error})
    }
})
router.post("/login", async (req,res)=>{
    try {
        const {mail, password, username} = req.body as {mail: string, password:string, username:string}
        const users = colleccion()

        const user = await users.findOne({mail: mail})
        if(!user) return res.status(400).json({message:" mail incorrecto"})
        
        const validPass = await bcrypt.compare(password, user.password)
        if(!validPass) return res.status(201).json({message: " contraseña incorrecta"})
        
        const token = jwt.sign({id: user._id?.toString(), mail: user.mail}, SECRET,{
            expiresIn: "1h"
        })

        res.status(201).json({message: {mail: user.mail, token: "Bearer "+token}})
    } catch (error) {
        res.status(500).json({message:error})
    }
})

export default router;