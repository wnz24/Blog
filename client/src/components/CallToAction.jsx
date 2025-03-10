import { Button } from 'flowbite-react'
import React from 'react'

const CallToAction = () => {
    return (
        <div className='flex flex-col sm:flex-row p-6 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center sm:text-left gap-6 sm:gap-12 w-full max-w-5xl mx-auto'>
            {/* Left Section */}
            <div className='flex-1 max-w-lg'>
                <h2 className='text-2xl font-semibold leading-tight'>Want to learn more about JavaScript?</h2>
                <p className='text-gray-500 my-3'>Check out these resources with 100 JavaScript projects to improve your skills.</p>
                <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none w-fit'>
                    <a href='https://100jsprojects.com' target='_blank' rel='noopener noreferrer'>100 JavaScript Projects</a>
                </Button>
            </div>

            {/* Right Section */}
            <div className='flex-1 flex justify-center'>
                <img 
                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRThki-9VcEdan2fveCVH8Oa1_cWnVU0wQN9A&s' 
                    alt='JavaScript Projects'
                    className='w-full max-w-[300px] sm:max-w-[350px] rounded-lg'
                />
            </div>
        </div>
    )
}

export default CallToAction
