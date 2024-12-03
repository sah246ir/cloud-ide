import { createContext } from "react"
import { FileStructureType } from "../pages/codeSandbox"

interface FileSystemContextType{
    ActiveFilePath:string|null,
    SetActiveFilePath:(path:string)=>void
    ActiveFolderPath:string|null,
    SetActiveFolderPath:(path:string)=>void
    RefetchFS:()=>void,
    fileStructure:FileStructureType[]
}
export const FileSystemContext = createContext<FileSystemContextType>({
    ActiveFilePath:null,
    SetActiveFilePath(path) {
        
    },
    ActiveFolderPath:null,
    SetActiveFolderPath(path) {
        
    },
    RefetchFS(){},
    fileStructure:[]
})