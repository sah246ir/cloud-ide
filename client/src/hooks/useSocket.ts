import { useState,useEffect } from "react"; 
export const useSocket = (url:string)=>{
    const WS_URL  =  "ws://"+url
    const [socket,setSocket] = useState<WebSocket | null>(null) 
    useEffect(()=>{
        const ws = new WebSocket(WS_URL);
        ws.onopen = ()=>{
            setSocket(ws)
        } 
        ws.onclose = ()=>{
            setSocket(null)
        } 
        return ()=>{
            ws.close()
        }
    } , []) 
    return socket
}