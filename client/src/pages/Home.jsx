import React, { useEffect, useState } from 'react'
import  { Link}  from 'react-router-dom'
import CallToAction from "../components/CallToAction"
import PostCard from '../components/PostCard'

const Home = () => {
  const [Posts,setPosts] = useState([])

  useEffect(()=>{
      const fetchPosts = async()=>{
        try {
          const res = await fetch(`/api/post/getposts`)
          const data = await res.json();
          setPosts(data.posts);
          console.log(data.posts)
        } catch (error) {
          
        }
      }
      fetchPosts();
  },[])
  return (
    <div>
      <div className=" flex flex-col gap-6 lg:p-18 px-3 max-w-6xl mx-auto">
        <h1 className='text-3xl font-bold lg:text-6xl pt-4'>Welcome to my Blog</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>Every thought, every story, every idea—this is your space to write, share, and connect with the world. Explore inspiring blogs, discover new perspectives, and start your own journey today!</p>

        <Link to='/search' className='text-sm sm:text-sm text-teal-500 font-bold hover:underline pb-12'>View all Posts</Link>
      </div>
      <div className='p-3 py-7 bg-amber-100 dark:bg-slate-700'>
        <CallToAction/>
      </div>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {Posts && Posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

              {Posts && Posts.map((post)=>(
                <PostCard key={post._id} post={post}/>
              ))}
            </div>
            <Link to={'/search'} className='text-lg text-teal-500 hover:underline text-center'>
            View all posts
            </Link>
            </div>
        )}
      </div>
    </div>
  )
}

export default Home
