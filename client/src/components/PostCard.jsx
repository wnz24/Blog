import React from 'react'
import { Link } from 'react-router-dom'

const PostCard = ({ post }) => {
  return (
    <div className='group relative w-full border border-teal-500 hover:border-2 min-h-[350px] overflow-hidden rounded-lg sm:w-[380px] transition-all flex flex-col'>
      
      {/* Image */}
      <Link to={`/post/${post.slug}`} className="w-full">
        <img 
          src={post.image} 
          alt={post.slug} 
          className='h-[180px] w-full object-cover transition-all duration-300'
        />
      </Link>

      {/* Content */}
      <div className='p-3 flex flex-col gap-2 flex-grow'>
        <p className='text-lg font-semibold line-clamp-2'>{post.title}</p>
        <span className='italic text-sm'>{post.category}</span>

        {/* Button inside the content flow */}
        <div className="mt-auto">
          <Link 
            to={`/post/${post.slug}`} 
            className='border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md block'
          >
            React article
          </Link>
        </div>
      </div>

    </div>
  )
}

export default PostCard
