import React, { useEffect, useState } from 'react'
import Language from '../components/Home/Language'
import { useNavigate } from 'react-router-dom'
import { Sandbox } from '../types/sandboxtypes'
import SandboxPreview from '../components/Home/Sandbox'
import { HOST } from '../constants'
import SandboxDialog from '../components/sandboxDialog'

interface LangType {
    language: string
}
const Home = () => {
    const [langs, Setlangs] = useState<LangType[]>([])
    const [boxes, Setboxes] = useState<Sandbox[]>([])
    const [loading, Setloading] = useState<boolean>(false)
    const navigate = useNavigate()
    const createsanbox = (language: string) => {
        Setloading(true)
        fetch(`${HOST}/sandbox`, {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                "language": language
            })
        })
            .then(res => {
                if(res.status!==200){throw Error()}
                return res.json()
            })
            .then((data: { sandbox_id: string }) => {
                Setloading(false)
                navigate(`/sandbox/${data.sandbox_id}`)
            }).catch(()=>{
                Setloading(false)
                alert("error occured! please try again later")
            })
    }

    const getLangs = () => {
        fetch(`${HOST}/languages`)
            .then(res => res.json())
            .then((data: { data: LangType[] }) => {
                Setlangs(data.data)
            })
    }
    const getSandboxes = () => {
        fetch(`${HOST}/sandbox`)
            .then(res => res.json())
            .then((data: Sandbox[]) => {
                Setboxes(data || [])
            })
    }
    useEffect(() => {
        getLangs()
        getSandboxes()
    }, [])
    return (
        <div>
            {loading && <SandboxDialog /> }
            <div
                className="flex items-center justify-center text-xl 
                   text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 
                   shadow-lg text-center flex-col mt-20"
            >
                <h1 className='text-4xl mb-1'>Welcome to <strong className="font-bold">Sandbox</strong></h1>
                <p>
                    enjoy coding in this browser <em className="italic"> IDE!</em>
                </p>

            </div>

            <div className="p-8">
                <h2 className='text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 
                   shadow-lg mb-4 text-xl'>Available Sandboxes</h2>

                <div className="flex flex-wrap gap-5 ">
                    {langs.map(lang => {
                        return (
                            <Language onClick={() => createsanbox(lang.language)} name={lang.language} img={`${lang.language}.png`} />
                        )
                    })}
                </div>

            </div>

            <div className="p-8">
                <h2 className='text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 
                   shadow-lg mb-4 text-xl'>Active Sandboxes</h2>

                <div className="flex flex-wrap gap-5 ">
                    {boxes.map(box => {
                        return (
                            <SandboxPreview sandbox={box} />
                        )
                    })}
                </div>

            </div>
        </div>
    )
}

export default Home
