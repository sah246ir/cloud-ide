import React, { useContext, useEffect, useState } from 'react'
import CodeEditor from '../components/CodeSandbox/codeEditor'
import FileSystem from '../components/CodeSandbox/fileSystem'
import { Terminal } from 'lucide-react'
import { FileSystemContext } from '../context/fileSystemContext';
import { SocketContext } from '../context/socketContext';
import { useSocket } from '../hooks/useSocket';
import { SandboxContext } from '../context/sandboxContext';
import { Sandbox } from '../types/sandboxtypes';
import SandboxContextProvider from '../components/SandboxProvider';
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


const CodeSandbox = () => {
  const {ideserver} = useContext(SandboxContext)

    
  return (
    <SandboxContextProvider>
          <div className=' flex'>
            <FileSystem />
            <CodeEditor />
          </div>
    </SandboxContextProvider>
  )
}

export default CodeSandbox
