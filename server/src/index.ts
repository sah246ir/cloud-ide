 
import express,{Request,Response,NextFunction} from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import { corsHeaders } from "./Middlewares/cors-headers"; 
import { config } from "dotenv";
import { IndexRouter } from "./Routes/indexRoute";
import mongoose from "mongoose";
import { SandboxRouter } from "./Routes/sandboxRoute";
import { ECS } from "@aws-sdk/client-ecs";
import { EC2 } from "@aws-sdk/client-ec2";
 
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
export const AWS_SUBNETS = (process.env.AWS_SUBNETS|| "").split(",")
export const AWS_SECURITYGROUPS = (process.env.AWS_SECURITYGROUPS|| "").split(",")
export const AWS_REGION = (process.env.AWS_REGION|| "")
export const AWS_ACCESSKEY = (process.env.AWS_ACCESSKEY|| "")
export const AWS_SECRETACCESSKEY = (process.env.AWS_SECRETACCESSKEY|| "")
export const AWS_CLUSTER = (process.env.AWS_CLUSTER|| "")

export const ecsClient = new ECS({
    region: AWS_REGION,
    credentials:{
        accessKeyId:AWS_ACCESSKEY,
        secretAccessKey:AWS_SECRETACCESSKEY
    } 
});
export const ec2Client = new EC2({
    region: AWS_REGION,
    credentials:{
        accessKeyId:AWS_ACCESSKEY,
        secretAccessKey:AWS_SECRETACCESSKEY
    } 
});

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

 
 


 
