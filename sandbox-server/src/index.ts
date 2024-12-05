
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import { corsHeaders } from "./Middlewares/cors-headers";
import { config } from "dotenv";
import { WebSocketServer } from "ws";
import * as pty from 'node-pty';
import * as fs from 'fs';

interface FileType {
    name: string;
    type: Exclude<string, "folder">;
  }
  
  interface FolderType {
    name: string;
    type: "folder";
    children: FileStructureType[];
  }
  
export type FileStructureType = FileType | FolderType;

config()
const app = express()
export const clients = (process.env.CLIENTS || "").split(",")

app.use(cors({
    origin: '*',
    credentials: true
}))

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }))
app.use(corsHeaders);

const HOMEDIR = process.cwd() + "/app"

app.get("/files",async(req:Request,res:Response)=>{
    const filechildren:FileStructureType[] = getFileTree(HOMEDIR,[])
    const filestructure:FileStructureType[] = filechildren
    return res.json({
        fs:filestructure
    })
})
app.post("/files/content",async(req:Request,res:Response)=>{
    const params = req.body as {path:string}
    if(!params.path){
        return res.json({})
    }
    const content = fs.readFileSync(process.cwd()+"/"+params.path,{
        encoding:"utf-8"
    })
    return res.json({
        content
    })
})

const getFileTree = (path:string,filestructure:any[]):FileStructureType[]=>{
    const appdir = fs.readdirSync(path)
    for(let file of appdir){
        const filepath = path+"/"+file
        if(fs.statSync(filepath).isDirectory()){
            const files = getFileTree(filepath,[])
            filestructure.push({
                name:file,
                type:"folder",
                children:files
            })
        }else{
            const [name,ext] = file.split(".")
            filestructure.push({
                name:name,
                type:ext||""
            })
        }
    }
    return filestructure
}



const server = app.listen(process.env.PORT, () => {
    console.log("server listening on http://localhost:" + process.env.PORT)
})









const Socket = new WebSocketServer({
    server
})
const Shell = pty.spawn("bash", [], {
    name: "xterm-color",
    cols: 80,
    rows: 30,
    cwd: HOMEDIR,
    env: process.env,
    encoding: "utf-8"
})

interface InputType {
    type: "terminal:command" | "terminal:request-fs" | "file:write",
    data: string
}
interface InputFileActionType {
    type: "file:write",
    path: string,
    data: string
}
 

Shell.onData((data:string) => { 
    Socket.clients.forEach(client => {
        const resjson = {
            type: "terminal:output",
            data: data
        }
        if (client.OPEN) {
            client.send(JSON.stringify(resjson))
        }
    })

})

Socket.on('connection', async(ws) => {
    console.log("client connected") 
    
    ws.on('message', (data:any) => {
        const json = JSON.parse(data) as InputType | InputFileActionType
        if (json.type === "terminal:command") {
            Shell.write(json.data)
        }else if (json.type === "file:write" && 'path' in json){
            fs.writeFileSync(process.cwd()+"/"+json.path,json.data)
        }
    })

     
})




