import React from 'react'
import { createSandbox } from '../../actions/sandboxActions'
import { Link, useNavigate } from 'react-router-dom'
import { Sandbox } from '../../types/sandboxtypes'
import { formatISODate } from '../../utils'

interface PropTypes {
    sandbox: Sandbox, 
}

const SandboxPreview = ({sandbox}: PropTypes) => {
    const icon = require("../../media/" + sandbox.language + ".png")
    const nav = useNavigate() 
    return (
        <div className='border p-4 flex flex-col justify-center items-center bg-white bg-opacity-0 hover:bg-opacity-5 transition duration-300'>
            <img src={icon} className='p-4' width={115} alt=""/>
            <div className="flex items-end gap-4">
                <div className="text-white">
                    <h2 className='text-left'>{sandbox.language}</h2>
                    <p className='text-xs text-gray-500 text-left'>Created: {formatISODate(sandbox.created_on)}</p>
                    <p className='text-xs text-gray-500 text-left'>Accessed: {formatISODate(sandbox.last_access)}</p>
                </div>
                <Link to={"/sandbox/"+sandbox.sandboxid} className='text-white transition duration-300 bg-green-700 px-2 py-0.5 rounded hover:bg-green-900'>
                    Enter
                </Link>
            </div>
        </div>
    )
}

export default SandboxPreview
