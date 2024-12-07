import { EC2Client,DescribeNetworkInterfacesCommand, EnaSupport } from "@aws-sdk/client-ec2";
import { DescribeTasksCommand, ECSClient,ListTasksCommand, RunTaskCommand} from "@aws-sdk/client-ecs";
import { config } from "dotenv";
import e, { Request,Response } from "express";
import { SandboxModel } from "../Models/Sandbox";
import { createSandboxContainer } from "../utils/create-docker-sandbox";
import { SuportedLanguagesModel } from "../Models/SuportedLanguages";
import { runTaskAndGetPublicIP } from "../utils/create-ecs-sandbox";
import { use_docker } from "..";
config()

 
export const CreateSandbox = async(req:Request,res:Response)=>{
    try{
        const data = req.body as {language:string}
        if(!data){
            return res.status(400).json({
                error:"Please provide a valid programming language"
            })
        }

        const lang = await SuportedLanguagesModel.findOne({
            language:data.language
        })
        if(!lang){
            return res.status(400).json({
                error:"Please provide a valid programming language"
            })
        }
        let containerIP;
        let containerId;
        let box;
        if(use_docker){
            const data = await createSandboxContainer(lang.image)
            containerIP = data.containerIP
            containerId = data.containerId
            box = await SandboxModel.create({
                created_on:new Date(),
                last_access:new Date(),
                language:lang.language,
                sandboxid:containerId,
                sandbox_ip:containerIP,
                ip:req.ip
            }) 
        }else{
            containerIP = await runTaskAndGetPublicIP(lang.image)
            box = await SandboxModel.create({
                created_on:new Date(),
                last_access:new Date(),
                language:lang.language,
                sandbox_ip:containerIP,
                ip:req.ip
            }) 
        }


        return res.status(200).json({
            sandbox_id:box.sandboxid,
        })
    } catch(e){
        console.log(e)
        res.status(500).json({
            error:"Unknown error occured"
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

        const sandbox = await SandboxModel.findOne({ sandboxid: id });

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

