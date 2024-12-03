import React, { useContext } from 'react'
import { FileSystemContext } from '../../context/fileSystemContext'
import { Play, Trash } from 'lucide-react'
import { SocketContext } from '../../context/socketContext'
interface PropTypes{
  name:string
  level?:number
  path:string
}



 
const File = ({name,level=0,path}:PropTypes) => {
  const support = ["js","py","txt"]
  const Socket = useContext(SocketContext)
  const fs = useContext(FileSystemContext)
  let ext = name.split(".")[1]
  if (!support.includes(ext)){
    ext = "txt"
  }

  let img
  img = require("../../media/"+ext+".png")
  const run = ()=>{ 
    Socket?.send(JSON.stringify({
      type: "terminal:command",
      data: ext==="js"?"node "+path.slice(4)+"\n":"python "+path.slice(4)+"\n"
    }))
  }

  const deletee = ()=>{ 
    if(!window.confirm("The file will be deleted permanently")) return
    Socket?.send(JSON.stringify({
      type: "terminal:command",
      data: "rm "+path.slice(4)+"\n"
    }))
  }
  return (
    <h3 
    className={`w-full flex justify-between items-center transition duration-300 hover:bg-gray-700 cursor-pointer  ${fs.ActiveFilePath===path && "bg-gray-700"} px-2 py-1` }
    style={{paddingLeft:(level?level*15:6)+"px"}}
    onClick={()=>fs.SetActiveFilePath(path)}
    >
        <div className="flex gap-2">
          {img && <img
          onError={ev=>{
            ev.currentTarget.src = "../../media/js.png"
          }}
           src={img} width={25} alt="" />}
          {name}
        </div>

        <div className="flex gap-2">
          <i title='delete file'>
            <Trash
            onClick={deletee}
            className='transition duration-300 text-gray-400 hover:text-white' size={15}
            />
          </i>
          <i title='run code'>
            <Play
            onClick={run}
            className='transition duration-300 text-gray-400 hover:text-white' size={15}
            />
          </i>
        </div>
    </h3> 
  )
}

export default File
