import React, { useState } from 'react'
import { Link  } from 'react-router-dom'
import { Sandbox } from '../../types/sandboxtypes'
import { formatISODate } from '../../utils'
import { HOST } from '../../constants'
import { LoaderCircle } from 'lucide-react'

interface PropTypes {
    sandbox: Sandbox, 
    onDelete: ()=>void, 
}

const SandboxPreview = ({sandbox,onDelete}: PropTypes) => {
    const icon = require("../../media/" + sandbox.language + ".png")
    const [load,Setload] = useState<boolean>(false)
    const deletesanbox = () => {
        if(!window.confirm("the sandbox will be deleted permanently"))return
        Setload(true)
        fetch(`${HOST}/sandbox/${sandbox.sandboxid}`, {
            method: "delete",
            headers: {
                "content-type": "application/json"
            }
        })
        .then(res => {
            if(res.status!==200){throw Error()}
            onDelete()
            return res.json()
        }).catch(()=>{
            alert("error occured! please try again later")
    })
    }
    return (
        <div className='border p-4 flex flex-col justify-center items-center bg-white bg-opacity-0 hover:bg-opacity-5 transition duration-300'>
            <img src={icon} className='p-4' width={115} alt=""/>
            <div className="flex items-end gap-4">
                <div className="text-white">
                    <h2 className='text-left'>{sandbox.language}</h2>
                    <p className='text-xs text-gray-500 text-left'>Created: {formatISODate(sandbox.created_on)}</p>
                    <p className='text-xs text-gray-500 text-left'>Accessed: {formatISODate(sandbox.last_access)}</p>
                </div>

                <div className="flex flex-col gap-2">
                    <button disabled={load} onClick={deletesanbox} className='text-white disabled:opacity-50 transition duration-300 bg-red-700 px-2 py-1 rounded hover:bg-red-900'>
                        {!load?"Delete":
                            <LoaderCircle size={20} className='m-auto animate-spin' />
                        }
                    </button>
                    {!load && <Link to={"/sandbox/"+sandbox.sandboxid} className='text-white transition duration-300 bg-green-700 px-2 py-0.5 rounded hover:bg-green-900'>
                        Enter
                    </Link>}
                </div>
            </div>
        </div>
    )
}

export default SandboxPreview
