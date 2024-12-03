import { createContext } from "react";

interface SandboxContextType{
    ideserver:string,
    language:string
}
export const SandboxContext = createContext<SandboxContextType>({
    ideserver:"",
    language:"text"
})