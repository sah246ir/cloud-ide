import React from 'react'
import CodeEditor from '../components/CodeSandbox/codeEditor'
import FileSystem from '../components/CodeSandbox/fileSystem'
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
