import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';
const Signup = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() })

  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out the form")
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message)
      }
      setLoading(false)
      if (res.ok) {
        navigate('/sign-in')
      }
    } catch (error) {
      setErrorMessage(error.message)
      setLoading(false)
    }
    console.log(formData)
  }
  return (
    <div className='min-h-screen mt-20'>
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
          <form className='flex flex-col gap-3' onSubmit={handleSubmit}>

            <div>
              <Label value='Your username' />
              <TextInput
                placeholder='username'
                id='username'
                onChange={handleChange}
              />
            </div>
            <div>
              < Label value='Your email' />
              <TextInput
                placeholder='name@company.com'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your password' />
              <TextInput
                placeholder='password'
                id='password'
                type='password'
                onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone='purpleToPink' className='w-full' type='submit' disabled={loading}>{loading ? (
              <>
                <Spinner size='sm' />
                <span>Loading...</span>
              </>
            ) : "Sign Up"}</Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-5 justify-center'>
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>Sign In</Link>

          </div>
          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>

    </div>
  )
}

export default Signup
