import React from 'react'
import { useNavigate } from 'react-router-dom'

interface PropTypes {
    name: string,
    img: string,
    onClick:()=>void
}

const Language = ({ name, img, onClick }: PropTypes) => {
    const icon = require("../../media/" + img)
    const nav = useNavigate() 
    return (
        <button onClick={onClick} className='transition duration-300 w-[100%] sm:min-w-80 sm:w-[48%] md:w-auto text-white bg-white bg-opacity-0 rounded-md font-extralight border-[.2px] border-gray-500 hover:bg-opacity-10 hover:border-gray-400 text-2xl py-5 flex items-center gap-2 px-5 justify-between'>
            {name}
            <img src={icon} width={35} alt="" />
        </button>
    )
}

export default Language
