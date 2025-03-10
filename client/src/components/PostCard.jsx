import React from 'react'
import { Link } from 'react-router-dom'

const PostCard = ({ post }) => {
  return (
    <div className="group relative w-full min-w-[280px] max-w-[340px] bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg duration-300 flex flex-col">
      
      {/* Image Section */}
      <Link to={`/post/${post?.slug}`} className="relative w-full block">
        <img 
          src={post?.image || "https://via.placeholder.com/300"} 
          alt={post?.title || "Post Image"} 
          className="h-[180px] w-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>

      {/* Content Section */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Category */}
        <span className="text-sm font-medium text-teal-600 uppercase tracking-wide">{post?.category || "Uncategorized"}</span>

        {/* Title */}
        <p className="text-lg font-semibold text-gray-900 line-clamp-2">
          {post?.title || "Untitled Post"}
        </p>

        {/* Spacer to push the button down */}
        <div className="flex-grow"></div>

        {/* Button */}
        <Link 
          to={`/post/${post?.slug}`} 
          className="border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md block font-medium"
        >
          Read More
        </Link>
      </div>

    </div>
  )
}

export default PostCard
