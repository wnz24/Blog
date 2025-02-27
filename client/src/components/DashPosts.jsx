import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux"
import { Button, Modal, Table } from "flowbite-react"
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'


const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [userPosts, setUserposts] = useState([])
  const [showMore, setShowMore] = useState(true);
  const [showmodel, setShowmodel] = useState(false);
  const [postId, setPostId] = useState('')


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`)
        const data = await res.json();
        if (res.ok) {
          setUserposts(data.posts)
          if (data.posts.length < 9) {
            setShowMore(false)
          }
        }
        console.log("posts:", data)
      } catch (error) {
        console.log(error.message)
      }
    }
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser?._id])


  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`)
      const data = await res.json();
      if (res.ok) {
        setUserposts((prev) => [...prev, ...data.posts])
        if (data.posts.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteUser = async () => {
    setShowmodel(false);
    try {
       const res = await fetch(`/api/post/deletepost/${postId}/${currentUser._id}`,
        {method: 'DELETE'}
       );
       const data = await res.json();
       if(!res.ok){
        console.log(data.message)
       }else{
        setUserposts((prev)=>{
          prev.filter((post)=> post._id !== postId)
        })
       }
       
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500' >
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell  >Delete</Table.HeadCell>
              <Table.HeadCell><span>Edit</span></Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body className='divide-y'  key={post._id}>
               
                <Table.Row  className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className='w-20 h-10 object-cover bg-gray-500'
                      />
                    </Link>

                  </Table.Cell>
                  <Table.Cell>
                    <Link className='font-medium dark:text-white text-gray-900' to={`/post/${post.slug}`}>
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    {post.category}
                  </Table.Cell>
                  <Table.Cell>
                    <span className='font-medium text-red-500 hover:underline cursor-pointer' onClick={() => {
                setShowmodel(true);
                setPostId(post._id);
              }}  >Delete</span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`} className='text-teal-500 hover:underline'>
                      <span>Edit</span>

                    </Link>
                  </Table.Cell>


                </Table.Row>
               
              </Table.Body>
            ))}


          </Table>
          {showMore && (
            <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7 bg-transparent'>Show more</button>

          )}
        </>

      ) :
        (
          <p>
            You have no posts yet!
          </p>

        )}
      <Modal show={showmodel} onClose={() => setShowmodel(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="text-5xl text-gray-500 dark:text-gray-200 mb-4 mx-auto" />
            <h3>Are you sure you want to delete this post?</h3>
            <div className='flex justify-center gap-4'>

              <Button onClick={handleDeleteUser} color='failure' className='mt-4 '>Yes, I'm sure</Button>
              <Button onClick={() => setShowmodel(false)} color='gray' className='mt-4'>cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashPosts
