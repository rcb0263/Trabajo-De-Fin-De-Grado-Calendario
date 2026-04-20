import { Db, MongoClient } from "mongodb";
import dotenv from "dotenv"

dotenv.config()

let dB: Db;
const dbName= "TFG"
export const connectMongoDB = async (): Promise<void> =>{
    try {
        const client = new MongoClient(`${process.env.MONGO_URI_ONLINE}`);
        //const client = new MongoClient(`${process.env.MONGO_URI_LOCAL}`);
        await client.connect();
        dB= client.db(dbName)
        console.log("Connected to mongodb at db "+ dbName)

    } catch (error) {
        console.log("Error Mongo: ", error)
    }
}


export const getDb= ():Db => dB;