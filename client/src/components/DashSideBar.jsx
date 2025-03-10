import React from 'react'
import { Sidebar, SidebarItem } from 'flowbite-react'
import { HiAnnotation, HiChartPie, HiDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi'
import { HiArrowSmRight } from "react-icons/hi";
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
const DashSideBar = () => {
  const { currentUser } = useSelector((state) => state.user)
  const location = useLocation()
  const [tab, setTab] = useState('')
  const dispatch = useDispatch();
  useEffect(() => {
    const urlParam = new URLSearchParams(location.search)
    const tabFormUrl = urlParam.get('tab')
    if (tabFormUrl) {
      setTab(tabFormUrl);
    }

  }, [location.search])

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(error.message)
      } else {
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
          {currentUser && currentUser.isAdmin && (
            <Link to='/dashboard?tab=dash'>
              <Sidebar.Item
                active={tab === 'dash' || !tab}
                icon={HiChartPie}
                as='div'
              >Dashboard</Sidebar.Item>
            </Link>
          )}
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
          {currentUser.isAdmin && (

            <Link to='/dashboard?tab=users'>
              <Sidebar.Item
                active={tab === 'users'}
                icon={HiOutlineUserGroup}
                as='div'
              >Users</Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (

            <Link to='/dashboard?tab=comments'>
              <Sidebar.Item
                active={tab === 'comments'}
                icon={HiAnnotation}
                as='div'
              >Comments</Sidebar.Item>
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

