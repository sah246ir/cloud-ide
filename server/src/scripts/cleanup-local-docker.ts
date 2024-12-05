import axios from "axios"
import { config } from "dotenv"
import mongoose from "mongoose"
import { SandboxModel } from "../Models/Sandbox"

config()
console.log(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI || "")
.then(()=>{
    clean().then(()=>{
        mongoose.connection.close()
        process.exit()
    }) 
})
.catch(e=>{
    console.log("Error connecting to mongodb")
    throw(e)
})

const docker = axios.create({
    socketPath: '/var/run/docker.sock',
    baseURL: 'http://localhost/v1.46',
    headers: { 'Content-Type': 'application/json' },
});

async function clean() {
    console.log("cleaning..........")
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000); 
    const sandboxes = await SandboxModel.find({
        // created_on: { $lt: twoHoursAgo }
    });
    
    for(let box of sandboxes){
        await docker.post(`/containers/${box.sandboxid}/stop`); 
        await docker.delete(`/containers/${box.sandboxid}`);    
        const sandboxes = await SandboxModel.deleteOne({
            sandboxid:box.sandboxid
        });
        console.log("deleted ",box.language," : ",box.sandboxid)
    }
    console.log("containers deleted..........")
}

