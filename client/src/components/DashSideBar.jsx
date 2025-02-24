import React from 'react'
import { Sidebar, SidebarItem } from 'flowbite-react'
import { HiDocumentText, HiUser } from 'react-icons/hi'
import { HiArrowSmRight } from "react-icons/hi";
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
const DashSideBar = () => {
  const {currentUser} = useSelector((state)=>state.user)
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
        <Sidebar.ItemGroup className='flex flex-col'>
          <Link to={'/dashboard?tab=profile'}>
            <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? "Admin" : "User"} labelColor='dark' className='cursor-pointer' as='div'>
              Profile
            </Sidebar.Item>
          </Link>
{currentUser.isAdmin && (

          <Link to='/dashboard?tab=posts'>
          <Sidebar.Item
          active={tab === 'posts'}
          icon={HiDocumentText}
          as='div'
          >Posts</Sidebar.Item>
          </Link>
)}

          <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignout}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  ) 
}

export default DashSideBar

