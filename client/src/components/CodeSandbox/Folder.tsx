import React, { useContext, useEffect, useRef, useState } from 'react'
import File from './File'
import { ChevronRight } from 'lucide-react'
import { FileStructureType } from '../../pages/codeSandbox'
import { FileSystemContext } from '../../context/fileSystemContext'

interface PropTypes {
  foldername: string,
  childrenfs: FileStructureType[],
  level?: number,
  path:string
}

const Folder = ({ foldername, childrenfs,path, level = 0 }: PropTypes) => {
  const [isOpen, setIsOpen] = useState(false)
  const el = useRef<HTMLDetailsElement>(null)
  const {SetActiveFolderPath} = useContext(FileSystemContext)
  const handleToggle = () => {
    const open = el.current?.open ?? false
    setIsOpen(open) 
  }

  useEffect(()=>{
    if(isOpen){
      SetActiveFolderPath("")
    }else{
      SetActiveFolderPath(path.slice(4))
    }
  },[])

  return (
    <details ref={el} className='w-full' onToggle={handleToggle} >
      <summary style={{paddingLeft:(level?level*11:0)+"px"}} className='list-none w-full flex items-center transition duration-300 hover:bg-gray-700 py-0.5 cursor-pointer'>
        <ChevronRight size={18} className={`inline-block ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
        {foldername}
      </summary>
      <article className='space-y-2 mt-2 mb-2'>
        {childrenfs.map(file => {
          if ("children" in file) {
            return (
                <Folder key={`${path}/${file.name}`} path={`${path}/${file.name}`} level={level+1} foldername={file.name} childrenfs={file.children} />
            );
          } else {
            return (
                <File key={`${path}/${file.name}`} path={`${path}/${file.name}${file.type ? `.${file.type}` : ""}`} level={level+1}  name={`${file.name}${file.type ? `.${file.type}` : ""}`} />
            );
          }
        })}
      </article>
    </details>
  )
}

export default Folder
