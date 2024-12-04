import React from 'react'
import DialogWrapper from './dialogWrapper'
import { LoaderCircle } from 'lucide-react'

const SandboxDialog = () => {
    return (
        <DialogWrapper>
            <div className="bg-black p-10 py-32 rounded-sm bg-opacity-70">
                <div
                    className="text-xl 
                            text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500
                            shadow-lg text-center flex-col"
                >
                    <p className='mb-2'>
                        Please be patient we are
                    </p>
                    <h1 className='text-4xl mb-1'>Creating your <strong className="font-bold">Sandbox</strong></h1>
                
                    <LoaderCircle size={35} className='inline mt-5 animate-spin text-orange-600' /> &nbsp;
                </div>
            </div>
        </DialogWrapper>
    )
}

export default SandboxDialog
