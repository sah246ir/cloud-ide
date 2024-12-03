import React, { useEffect, useState } from 'react'
import { SandboxContext } from '../context/sandboxContext'
import { FileSystemContext } from '../context/fileSystemContext'
import { Sandbox } from '../types/sandboxtypes';
import { useNavigate, useParams } from 'react-router-dom';
import { SocketContext } from '../context/socketContext';
import { HOST } from '../constants';

interface FileType {
  name: string;
  type: Exclude<string, "folder">;
}

interface FolderType {
  name: string;
  type: "folder";
  children: FileStructureType[];
}


export type FileStructureType = FileType | FolderType;

interface PropTypes {
  children: React.ReactNode
}
const SandboxContextProvider = ({ children }: PropTypes) => {
  const nav = useNavigate()
  const [Url, SetUrl] = useState<string>("")
  const [ActiveFilePath, SetActiveFilePath] = useState<string | null>(null)
  const [ActiveFolderPath, SetActiveFolderPath] = useState<string | null>(null)
  const [fileStructure, SetFileStructure] = useState<FileStructureType[]>([])
  const fetchFS = () => {
    fetch(`http://${Url}/files`)
      .then(res => res.json())
      .then((data: { fs: FileStructureType[] }) => {
        SetFileStructure([...data.fs])
      })
  }

  const params = useParams()
  const fetchSandbox = () => {
    fetch(`http://${HOST}/sandbox/` + params.id)
      .then(res => res.json())
      .then((data: {sandbox:Sandbox}) => {
      SetUrl(data.sandbox.sandbox_ip + ":8080")
      }).catch(e => {
        alert("The Sandbox is either invalid or has been deleted")
        nav("/")
      })
  }
  useEffect(() => {
    if(Url){ 
      fetchFS()
    }
  }, [Url])
  useEffect(() => {
    fetchSandbox()
  }, [])

  const [socket, setSocket] = useState<WebSocket | null>(null)
  useEffect(() => { 
    if (!Url) return
    const WS_URL = "ws://" + Url
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      setSocket(ws)
    }
    ws.onclose = () => {
      setSocket(null)
    }
    return () => {
      ws.close()
    }
  }, [Url])
  return (
    <SocketContext.Provider value={socket}>
    <SandboxContext.Provider value={{ language: "javascript", ideserver: Url }}>
      <FileSystemContext.Provider value={{ SetActiveFolderPath, ActiveFolderPath, ActiveFilePath, SetActiveFilePath, RefetchFS: fetchFS, fileStructure }}>
        {children}
      </FileSystemContext.Provider>
    </SandboxContext.Provider>
    </SocketContext.Provider>
  )
}

export default SandboxContextProvider
