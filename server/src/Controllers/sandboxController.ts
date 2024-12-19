import { config } from "dotenv";
import e, { Request,Response } from "express";
import { SandboxModel } from "../Models/Sandbox";
import { createSandboxContainer, stopAndRemoveContainer } from "../utils/create-docker-sandbox";
import { SuportedLanguagesModel } from "../Models/SuportedLanguages";
import { runTaskAndGetPublicIP, stopTask } from "../utils/create-ecs-sandbox";
import { use_docker } from "..";
config()

 
export const CreateSandbox = async(req:Request,res:Response)=>{
    try{
        const count = await SandboxModel.countDocuments({
            ip:req.ip
        })

        if(count>=3){
            return res.status(400).json({
                message:"Only 3 active sandboxes allowed"
            })
        }
        const data = req.body as {language:string}
        if(!data){
            return res.status(400).json({
                message:"Please provide a valid programming language"
            })
        }

        const lang = await SuportedLanguagesModel.findOne({
            language:data.language
        })
        if(!lang){
            return res.status(400).json({
                message:"Please provide a valid programming language"
            })
        } 
        let box;
        if(use_docker){
            const data = await createSandboxContainer(lang.image) 
            box = await SandboxModel.create({
                created_on:new Date(),
                last_access:new Date(),
                language:lang.language,
                sandboxid:data.containerId,
                sandbox_ip:data.containerIP,
                ip:req.ip
            }) 
        }else{
            const data = await runTaskAndGetPublicIP(lang.image) 
            box = await SandboxModel.create({
                created_on:new Date(),
                last_access:new Date(),
                language:lang.language,
                sandbox_ip:data.containerIP,
                sandboxid:data.containerId,
                ip:req.ip
            }) 
        }
 
        return res.status(200).json({
            sandbox_id:box.sandboxid,
        })
    } catch(e){
        console.log(e)
        res.status(500).json({
            message:"Unknown error occured"
        })
    }
}

 
export const GetSandbox = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "Sandbox ID is required",
            });
        } 
        const sandbox = await SandboxModel.findById(id); 
        if (!sandbox) {
            return res.status(404).json({
                error: "Sandbox not found",
            });
        } 
        return res.json({
            sandbox,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            error: "Unknown error occurred",
        });
    }
};

export const GetActiveSandboxes = async (req: Request, res: Response) => {
    try {    
        const sandboxes = await SandboxModel.find({ ip: req.ip }); 
        return res.json(sandboxes);
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            error: "Unknown error occurred",
        });
    }
};



export const DeleteSandbox = async (req: Request, res: Response) => {
    try {    
        const sandbox_id = req.params.sandboxid
        const sandbox = await SandboxModel.findOne({ sandboxid: sandbox_id }); 
        if(!sandbox){
            return res.status(404).json({})
        }
        if(use_docker){
            await stopAndRemoveContainer(sandbox.sandboxid)
        }else{
            await stopTask(sandbox.sandboxid) 
        }

        await SandboxModel.deleteOne({sandboxid:sandbox.sandboxid})
        return res.json(sandbox_id);
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            error: "Unknown error occurred",
        });
    }
};

