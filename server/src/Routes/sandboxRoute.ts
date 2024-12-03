import { Router } from "express";
import { CreateSandbox, GetActiveSandboxes, GetSandbox } from "../Controllers/sandboxController";

export const SandboxRouter = Router()
 
SandboxRouter.post("",CreateSandbox)
SandboxRouter.get("/:id",GetSandbox)
SandboxRouter.get("",GetActiveSandboxes)


