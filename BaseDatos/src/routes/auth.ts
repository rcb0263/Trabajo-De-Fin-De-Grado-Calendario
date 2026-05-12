import { Router } from "express"
import { getDb } from "../mongo"
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Usuario } from "../tipos";
import { esAdmin, usuarioCorrecto, verifyAdmin, verifyUsuario } from "../collections/privilegios";
import { verifyToken } from "../middleware/verifytoken";

const router = Router();
const colleccion = () => {return getDb().collection<Usuario>('placeholder');}

const SECRET = process.env.SECRET||""; 
const PEPPER = process.env.PEPPER_SECRET||"";

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



router.post("/esAdmin", verifyToken, async (req, res)=>{
    await esAdmin(req,res).then((e)=>{
        if(e ==true){
            res.status(200).json('OK')
        }else{
            res.status(401).json('NO')
        }    })
})
router.post("/verificarUsuario", verifyToken, async (req, res)=>{
    await usuarioCorrecto(req,res).then((e)=>{
        if(e ==true){
            res.status(200).json('OK')
        }else{
            res.status(401).json('NO')
        }    })
})
export default router;