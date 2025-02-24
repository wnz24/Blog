import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import DashSideBar from '../components/DashSideBar'
import DashProfile from '../components/DashProfile'
import DashPosts from '../components/DashPosts'

const Dashboard = () => {
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
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSideBar/>
      </div>

      {/* Profile */}
      {tab === 'profile' && <DashProfile/> }
      {tab === 'posts' && <DashPosts/> }


    </div>
  )
}

export default Dashboard
