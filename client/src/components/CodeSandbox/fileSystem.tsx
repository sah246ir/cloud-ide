import React, { useContext, useEffect, useState } from 'react';
import Folder from './Folder';
import File from './File';
import { FileSystemContext } from '../../context/fileSystemContext';
import { Plus } from 'lucide-react';
import { SocketContext } from '../../context/socketContext';


const FileSystem = () => {
  const { fileStructure, ActiveFolderPath } = useContext(FileSystemContext)
  const Socket = useContext(SocketContext)
  const [newfile, Setnewfile] = useState<string>("")
  const [newfolder, Setnewfolder] = useState<string>("")

  const create = (type: 'file' | 'folder') => {
    const isfile = type === "file"
    Socket?.send(JSON.stringify({
      type: "terminal:command",
      data: isfile ? `touch ${ActiveFolderPath ? ActiveFolderPath + "/" : ""}${newfile}\n\r` : `mkdir ${ActiveFolderPath ? ActiveFolderPath + "/" : ""}${newfolder}\n\r`
    }))
    if (isfile) Setnewfile("")
    if (!isfile) Setnewfolder("")
  }

  console.log(fileStructure)
  return (
    <section className='h-[100vh] w-[20%] min-w-[190px] bg-gray-800 text-white space-y-2'>
      <div className='mb-'>
        <h1 className='bg-black bg-opacity-40  text-xs text-center p-1 text-gray-300'>File Explorer</h1>
        <div className=' flex flex-col px-2 gap-3 text-gray-400 justify-end mt-2'>
          <div className="flex gap-1 items-center">
            <input value={newfile} onChange={(e) => Setnewfile(e.target.value)} placeholder='new file name' className='w-full px-1 py-1 bg-white text-white bg-opacity-25' type="text" />
            <button onClick={() => create('file')} className='disabled:opacity-60' disabled={!newfile.trim()}>
              <Plus className='hover:text-white transition duration-300 cursor-pointer' size={25} />
            </button>
          </div>
          <div className="flex gap-1 items-center">
            <input value={newfolder} onChange={(e) => Setnewfolder(e.target.value)} placeholder='new folder name' className='w-full px-1 py-1 bg-white text-white bg-opacity-25' type="text" />
            <button onClick={() => create('folder')} className='disabled:opacity-60' disabled={!newfolder.trim()}>
              <Plus className='hover:text-white  transition duration-300 cursor-pointer' size={25} />
            </button>
          </div>
        </div>
      </div>
      <hr className='!mt-5 !mb-5' />
      <div className='px-1 text-md'>
        {fileStructure.map(file => {
          if ("children" in file) {
            return (
              <div key={file.name}>
                <Folder path={"app/" + file.name} foldername={file.name} childrenfs={file.children} />
              </div>
            );
          } else {
            return (
              <div key={file.name}>
                <File
                  path={`app/${file.name}${file.type ? `.${file.type}` : ""}`}
                  name={`${file.name}${file.type ? `.${file.type}` : ""}`}
                />
              </div>

            );
          }
        })}
      </div>
    </section>
  );
};

export default FileSystem;
