import { Router } from "express";
import { GetSupportedLanguages } from "../Controllers/indexController";

export const IndexRouter = Router()

IndexRouter.get("/languages",GetSupportedLanguages)
