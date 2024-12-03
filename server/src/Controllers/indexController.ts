import { Request,Response } from "express";
import { SuportedLanguagesModel } from "../Models/SuportedLanguages";


export const GetSupportedLanguages = async(req:Request,res:Response)=>{
    try{
        const list = await SuportedLanguagesModel.find(
            {},
            {
                language:true 
            }
        )
        res.status(200).json({
            data:list
        })
    } catch(e){
        res.status(500).json({
            message:"Unknown error occured"
        })
    }
}