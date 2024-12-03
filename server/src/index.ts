 
import express,{Request,Response,NextFunction} from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import { corsHeaders } from "./Middlewares/cors-headers"; 
import { config } from "dotenv";
import { IndexRouter } from "./Routes/indexRoute";
import mongoose from "mongoose";
import { SandboxRouter } from "./Routes/sandboxRoute";
 
config()
mongoose.connect(process.env.MONGODB_URI || "")
.then(()=>{
    console.log("mongodb connected successfully")
})
.catch(e=>{
    console.log("Error connecting to mongodb")
    console.log(e)
})
const app = express() 
// initialize services
export const clients = (process.env.CLIENTS || "").split(",")

app.use(cors({
    origin: clients,// array of client urls
    credentials: true
}))

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false })) 

// custom headers
app.use(corsHeaders);

// routes
app.use("", IndexRouter) 
app.use("/sandbox", SandboxRouter) 
 

// server listen
const server = app.listen(process.env.PORT, () => {
    console.log("server listening on http://localhost:"+process.env.PORT)
})

 
 


 
