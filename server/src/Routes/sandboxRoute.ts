import { Router } from "express";
import { CreateSandbox, DeleteSandbox, GetActiveSandboxes, GetSandbox } from "../Controllers/sandboxController";

export const SandboxRouter = Router()
 
SandboxRouter.post("",CreateSandbox)
SandboxRouter.get("/:id",GetSandbox)
SandboxRouter.delete("/:id",DeleteSandbox)
SandboxRouter.get("",GetActiveSandboxes)


