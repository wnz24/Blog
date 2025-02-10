import React from 'react'
import { Sidebar } from 'flowbite-react'
import { HiUser } from 'react-icons/hi'
import { HiArrowSmRight } from "react-icons/hi";
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
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
  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to={'/dashboard?tab=profile'}>
            <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={'User'} labelColor='dark' className='cursor-pointer'>
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer'>
            Sign Out

          </Sidebar.Item>
        </Sidebar.ItemGroup>

      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSideBar

