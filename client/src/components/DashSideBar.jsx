import React from 'react'
import { Sidebar } from 'flowbite-react'
import { HiUser } from 'react-icons/hi'
import { HiArrowSmRight } from "react-icons/hi";
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
const DashSideBar = () => {
  const location = useLocation()
  const [tab, setTab] = useState('')
  useEffect(() => {
    const urlParam = new URLSearchParams(location.search)
    const tabFormUrl = urlParam.get('tab')
    if (tabFormUrl) {
      setTab(tabFormUrl);
    }

  }, [location.search])

   const handleSignout = async()=>{
          try {
            const res = await fetch('/api/user/signout',{
              method:'POST',
            });
            const data = await res.json();
            if(!res.ok){
              console.log(error.message)
            }else{
              dispatch(signoutSuccess()); 
            }
          } catch (error) {
            console.log(error)
          }
        }
  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to={'/dashboard?tab=profile'}>
            <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={'User'} labelColor='dark' className='cursor-pointer' as='div'>
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignout}>
            Sign Out

          </Sidebar.Item>
        </Sidebar.ItemGroup>

      </Sidebar.Items>
    </Sidebar>
  ) 
}

export default DashSideBar

