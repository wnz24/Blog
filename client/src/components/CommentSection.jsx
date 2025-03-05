import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux"
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Modal, Textarea } from "flowbite-react"
import Comment from './Comment';
import {HiOutlineExclamationCircle} from "react-icons/hi"

const CommentSection = ({ postId }) => {
    const { currentUser } = useSelector((state) => state.user);
    const [comment, setComment] = useState('')
    const [commentError, setCommentError] = useState(null); // Fixed typo
    const [comments, setComments] = useState([])
    const [showModel,setShowModel] = useState(false)
    const [commentToDelete,setCommentToDelete] = useState(null)
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Corrected validation logic
        if (!comment.trim()) {
            setCommentError("Comment cannot be empty.");
            return;
        }
        if (comment.length > 200) {
            setCommentError("Comment cannot exceed 200 characters.");
            return;
        }

        try {
            const res = await fetch('/api/comment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: comment, postId, userId: currentUser._id }),
            });

            const data = await res.json();

            if (res.ok) {
                setComment('');
                setCommentError(null);
                setComments([data, ...comments]);
            } else {
                setCommentError(data.message || "Failed to submit comment.");
            }
        } catch (error) {
            setCommentError(error.message);
        }
    };

    const handleOnLike = async (commentId) => {
        try {
            if (!currentUser) {
                navigate('/sign-in');
                return
            }
            const res = await fetch(`/api/comment/likeComment/${commentId}`, {
                method: 'PUT'
            }
            )
            if (res.ok) {
                const data = await res.json();
                setComments(comments.map((comment) =>
                    comment._id === commentId
                        ? { ...comment, likes: data.likes, numberOfLikes: data.numberOfLikes }
                        : comment
                ));
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleEdit = async (comment, editedContent) => {
        setComments(
            comments.map((c) => 
                c._id === comment._id ? { ...c, content: editedContent } : c
            )
        )
    }
    const handleDelete = async (commentId) =>{
        setShowModel(false)
            try {
                if(!currentUser){
                    navigate('/sign-in')
                    return
                }
                const res = await fetch(`/api/comment/deleteComment/${commentId}`,{
                    method:"DELETE"
                });
                if(res.ok){
                    const data = await res.json()
                            setComments(
                                comments.filter((comment)=> comment._id !== commentId)
                            ) 
                    
                }
            } catch (error) {
                console.log(error)
            }
    }

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/comment/getPostComments/${postId}`)
                const data = await res.json();
                setComments(data);
            } catch (error) {
                console.log(error)
            }
        }
        getComments();
    }, [postId])


    return (
        <div className='max-w-2xl mx-auto w-full p-3'>
            {currentUser ? (
                <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                    <p>Signed in as:</p>
                    <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePhoto} alt='' />
                    <Link className='text-xs text-cyan-500' to={'/dashboard?tab=profile'}>@{currentUser.username}</Link>
                </div>
            ) : (
                <div className='text-sm text-teal-500 my-5 flex gap-1'>
                    You must be signed in to comment.
                    <Link className='text-blue-500 hover:underline' to={'/sign-in'}>Sign In</Link>
                </div>
            )}
            {currentUser && (
                <form className='border border-teal-500 rounded-md p-3' onSubmit={handleSubmit}>
                    <Textarea
                        placeholder='Add a comment...'
                        rows='3'
                        maxLength='200'
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                    />
                    <div className='flex justify-between items-center mt-5'>
                        <p className='text-gray-500 text-xs'>{200 - comment.length} characters left</p>
                        <Button outline gradientDuoTone='purpleToBlue' type='submit'>Submit</Button>
                    </div>
                    {commentError && (
                        <Alert color='failure' className="mt-2">{commentError}</Alert> // Ensure alert is displayed
                    )}
                </form>
            )}
            {comments.length === 0 ? (
                <p className='text-sm my-5'>No comments yet!</p>
            ) : (
                <>
                    <div className='text-sm my-5 flex items-center gap-1'>
                        <p>Comments</p>
                        <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                            <p>{comments.length}</p>
                        </div>
                    </div>
                    {Array.isArray(comments) && comments.length > 0 ? (
                        comments.map((comment) =>
                            comment ? (
                                <Comment
                                    key={comment._id}
                                    comment={comment}
                                    onLike={handleOnLike}
                                    onEdit={handleEdit}
                                onDelete ={(commentId)=>{
                                    setShowModel(true)
                                    setCommentToDelete(commentId)
                                }
                                    }
                                />
                            ) : null
                        )
                    ) : (
                        <p>No comments available</p>
                    )}
                </>
            )}
               <Modal show={showModel} onClose={() => setShowModel(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="text-5xl text-gray-500 dark:text-gray-200 mb-4 mx-auto" />
            <h3>Are you sure you want to delete this post?</h3>
            <div className='flex justify-center gap-4'>

              <Button onClick={()=>handleDelete(commentToDelete)} color='failure' className='mt-4 '>Yes, I'm sure</Button>
              <Button onClick={() => setShowModel(false)} color='gray' className='mt-4'>cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
        </div>
        
    );
}

export default CommentSection;
