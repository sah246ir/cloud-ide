import React, { useContext, useEffect, useState } from 'react'
import { Editor } from '@monaco-editor/react'
import { FileSystemContext } from '../../context/fileSystemContext'
import { SocketContext } from '../../context/socketContext'
import Terminal from './Terminal'
import { SandboxContext } from '../../context/sandboxContext'
import { LoaderCircle } from 'lucide-react'

const CodeEditor = () => {
    const { ideserver, language } = useContext(SandboxContext)
    const [Default, SetDefault] = useState<string>("")
    const [Initialized, SetInitialized] = useState<boolean>(false)
    const socket = useContext(SocketContext)
    const { ActiveFilePath } = useContext(FileSystemContext)
    const writefile = (val: string) => {
        if (!socket) return
        if (!Initialized) return
        socket.send(JSON.stringify({
            type: "file:write",
            path: ActiveFilePath,
            data: val
        }))
    }
    useEffect(() => {
        if (!ideserver || !ActiveFilePath) return
        console.log(JSON.stringify({
            path: ActiveFilePath
        }))
        fetch(`http://${ideserver}/files/content`, {
            method: "post",
            headers: {
                "Content-Type": "application/json" // Ensure headers are set correctly for JSON data
            },
            body: JSON.stringify({
                path: ActiveFilePath
            })
        })
            .then(res => res.json())
            .then((data: { content: string }) => {
                SetDefault(data.content)
                SetInitialized(true)
            })
            .catch(e => console.log(e))
    }, [ActiveFilePath,ideserver])
    return (
        <div
            className='gap-5 h-[100vh] relative flex flex-col flex-grow'
            style={{ backgroundColor: "#1e1e1e" }}
        >
            <div className='p-4 z-0'>
                {ActiveFilePath ? (
                    <Editor
                        className='p-4'
                        theme="vs-dark"
                        height="70vh"
                        language={language}
                        onChange={(val, ev) => { writefile(val || "") }}
                        value={Default}
                    />
                ) : (
                    <div
                        className="flex items-center justify-center text-xl h-[70vh] 
                        text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 
                        shadow-lg text-center flex-col"
                    >
                        <h1 className='text-4xl mb-1'>Welcome to <strong className="font-bold">Sandbox</strong></h1>
                        <p>
                            enjoy coding in this browser <em className="italic"> IDE!</em>
                        </p>
                        {!socket && 
                        <div className='text-red-600 font-extralight text-lg mt-6 flex items-center'>
                            <LoaderCircle className='inline animate-spin' /> &nbsp;
                            <p>We're unable to find the sandbox</p>
                        </div>
                        }
                    </div>
                )}
            </div>

            <Terminal />
        </div>

    )
}

export default CodeEditor
