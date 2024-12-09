import mongoose from "mongoose";
import { SuportedLanguagesModel } from "./Models/SuportedLanguages";
import { config } from "dotenv";
config()

console.log(process.env.MONGODB_URI || "")
mongoose.connect(process.env.MONGODB_URI || "")
.then(async()=>{
    await SuportedLanguagesModel.insertMany([
        {
            language:"javascript",
            image:"code-sandbox-js"
        },
        {
            language:"python",
            image:"code-sandbox-py"
        }
    ])
    mongoose.connection.close()
})
.catch(e=>{
    console.log("Error connecting to mongodb")
    console.log(e)
})
