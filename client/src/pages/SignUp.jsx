import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'
const Signup = () => {
  return (
    <div  className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center'>
      {/* left side */}

      <div className='flex-1'>
          <Link to="/" className='font-bold dark:text-white text-4xl'>
                <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Noor's</span>
                Blog
            </Link>
            <p className='text-sm mt-5'>
            🛠️ Tech Updates, Coding Tips & More - Just One Signup Away!
            </p>
      </div>
      {/* right side */}
      <div className='flex-1'>
       <form className='flex flex-col gap-3'>

        <div>
          <Label value='Your username'/>
          <TextInput
          placeholder='username'
          id='username'
          
          />
        </div>
        <div>
          < Label value='Your email'/>
          <TextInput
          placeholder='name@company.com'
          id='email'

          />
        </div>
        <div>
          <Label value='Your password'/>
          <TextInput
          placeholder='password'
          id='password'
          />
        </div>
        <Button gradientDuoTone='purpleToPink' className='w-full' type='submit'>Sign Up</Button>
       </form>
       <div className='flex gap-2 text-sm mt-5'>
        <span>Have an account?</span>
        <Link to='/sign-in' className='text-blue-500'>Sign In</Link>

       </div>
      </div>
      </div>
      
    </div>
  )
}

export default Signup
