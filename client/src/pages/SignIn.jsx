import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import OAuth from '../components/OAuth'

const Signin = () => {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error: errormessage } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill out the form"));
    }

    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center'>
        {/* Left side */}
        <div className='flex-1'>
          <Link to="/" className='font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Noor's</span>
            Blog
          </Link>
          <p className='text-sm mt-5'>
            You can sign in with your email and password
          </p>
        </div>

        {/* Right side */}
        <div className='flex-1'>
          <form className='flex flex-col gap-3' onSubmit={handleSubmit}>
            <div>
              <Label value='Your email' />
              <TextInput
                placeholder='name@company.com'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your password' />
              <TextInput
                placeholder='*********'
                id='password'
                type='password'
                onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone='purpleToPink' className='w-full' type='submit' disabled={loading}>
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span>Loading...</span>
                </>
              ) : "Sign In"}
            </Button>
            <OAuth />
          </form>
          
          <div className='flex gap-2 text-sm mt-5 justify-center'>
            <span>Don't have an account?</span>
            <Link to='/sign-up' className='text-blue-500'>Sign Up</Link>
          </div>

          {errormessage && (
            <Alert className='mt-5' color='failure'>
              {errormessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signin;
