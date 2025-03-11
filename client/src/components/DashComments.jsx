import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux"
import { Button, Modal, Table, Spinner } from "flowbite-react"
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { FaCheck,FaTimes  } from "react-icons/fa";

const DashComments = () => {
    const { currentUser } = useSelector((state) => state.user)
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true);
    const [showMore, setShowMore] = useState(true);
    const [showmodel, setShowmodel] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState('')
  
    useEffect(() => {
      const fetchComments = async () => {
        try {
          const res = await fetch('/api/comment/getcomments')
          const data = await res.json();
          if (res.ok) {
            setComments(data.comments)
            if (data.comments.length < 9) {
              setShowMore(false)
            }
          }
          console.log("posts:", data)
        } catch (error) {
          console.log(error.message)
        } finally {
          setLoading(false);
        }
      }
      if (currentUser.isAdmin) {
        fetchComments();
      }
    }, [currentUser?._id])
   
    const handleShowMore = async () => {
      const startIndex = comments.length;
      try {
        const res = await fetch(`/api/comment/getComments?startIndex=${startIndex}`)
        const data = await res.json();
        if (res.ok) {
          setComments((prev) => [...prev, ...data.comments])
          if (data.comments.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
  
    const handleDeleteComment = async () => {
        console.log("Delete Comment")
      setShowmodel(false);
      try {
         const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`,
          {method: 'DELETE'}
         );
         const data = await res.json();
         if(res.ok){
            setComments((prev)=> prev.filter((comment)=> comment._id !== commentIdToDelete))
            setShowmodel(false)
          
         }else{
          console.log(data.message)
         }
      } catch (error) {
        console.log(error.message)
      }
    }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500' >
      {loading ? (
        <div className='flex justify-center items-center h-32'>
          <Spinner size='xl' />
        </div>
      ) : currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Comment Content</Table.HeadCell>
              <Table.HeadCell>Number Of Likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body className='divide-y'  key={comment._id}>
                <Table.Row  className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    {comment.content}
                  </Table.Cell>
                  <Table.Cell>
                   {Number(comment.numberOfLikes)}
                  </Table.Cell>
                  <Table.Cell>
                    {comment.postId}
                  </Table.Cell>
                  <Table.Cell>
                    {comment.userId}
                  </Table.Cell>
                  <Table.Cell>
                    <span className='font-medium text-red-500 hover:underline cursor-pointer' onClick={() => {
                setShowmodel(true);
                setCommentIdToDelete(comment._id);
              }}  >Delete</span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7 bg-transparent'>Show more</button>
          )}
        </>
      ) : (
          <p>
            You have no comments yet!
          </p>
      )}
      <Modal show={showmodel} onClose={() => setShowmodel(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="text-5xl text-gray-500 dark:text-gray-200 mb-4 mx-auto" />
            <h3>Are you sure you want to delete this comment?</h3>
            <div className='flex justify-center gap-4'>
              <Button onClick={handleDeleteComment} color='failure' className='mt-4 '>Yes, I'm sure</Button>
              <Button onClick={() => setShowmodel(false)} color='gray' className='mt-4'>cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashComments
