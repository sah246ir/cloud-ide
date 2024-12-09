import React, { useContext, useEffect, useRef, useState } from 'react'
import { FileSystemContext } from '../../context/fileSystemContext'
import { Terminal as XTerminal } from "@xterm/xterm"
import "@xterm/xterm/css/xterm.css"
import { SocketContext } from '../../context/socketContext'
interface InputType {
    type: "terminal:write" | "terminal:output",
    data: string
}
const Terminal = () => { 
    const Socket = useContext(SocketContext)
    const { RefetchFS } = useContext(FileSystemContext)
    // useEffect(() => {
    //     if (!Socket) return;  
    //     Socket.onmessage = (event: MessageEvent) => {
    //         const sockdata = JSON.parse(event.data) as InputType; 
    //         const formattedData = sockdata.data.replace(/\n/g, '<br/>');
    //         SetConvo((prev)=>[...prev,formattedData||""])
    //         console.log(formattedData)
    //     };  
    //     return () => {
    //         if (Socket) {
    //             Socket.onmessage = null; 
    //         }
    //     };
    // }, [Socket]);

    // useEffect(()=>{
    //     if(!cmd) return

    //     if (!Socket) return;  
    //     const go = (e:KeyboardEvent)=>{
    //         if(e.key!=="Enter") return
    //         if(cmd==="clear"){
    //             SetConvo([])
    //             Setcmd("")
    //             return
    //         }
    //         Socket.send(JSON.stringify({
    //             type:"terminal:command",
    //             data:cmd+"\n"
    //         }))
    //         Setcmd("")
    //         RefetchFS()
    //     }
    //     window.addEventListener('keyup', go);
    //     return () => { 
    //         window.removeEventListener('keyup', go);
    //     };
    // },[Socket,cmd])

    const Tref = useRef(null)
    useEffect(() => {
        if (!Socket) return
        const term = new XTerminal({
            rows: 20,
            cursorBlink: true
        })
        if (!Tref.current) return
        term.open(Tref.current)
        term.onData((data) => {
            if (Socket) {
                Socket.send(JSON.stringify({
                    type: "terminal:command",
                    data: data
                }))
            }
        })
        if (!Socket) return
        Socket.onmessage = (event: MessageEvent) => {
            const sockdata = JSON.parse(event.data) as InputType;
            term.write(sockdata.data)
            RefetchFS()
        };
        Socket.send(JSON.stringify({
            type: "terminal:command",
            data: "\r"
        }))
        return ()=>{
            Socket.onmessage = null
        }
    }, [Socket])
    return (
        <>
            <div ref={Tref} id="terminal-id" className='bg-black p-2 text-white w-full flex-grow relative overflow-auto cursor-text '> 
            </div>

        </>
    )
}

export default Terminal
