import { Button, Table } from 'flowbite-react'
import React, { useState,useEffect } from 'react'
import { use } from 'react'
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const DashboardComponent = () => {
    const [users, setUser] = useState([])
    const [comments, setComments] = useState([])
    const [posts, setPOsts] = useState([])
    const [totalUsers, setTotalUsers] = useState([])
    const [totalPosts, setTotalPosts] = useState([])
    const [totalComments, setTotalComments] = useState([])
    const [lastMonthUsers, setLastMonthUsers] = useState([])
    const [lastMonthPosts, setLastMonthPosts] = useState([])
    const [lastMonthComments, setLastMonthComments] = useState([])

    const { currentUser } = useSelector((state) => state.user)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers?limit=5`)
                const data = await res.json();
                console.log("UserData:", data)
                if (res.ok) {
                    setUser(data.users)
                    setTotalUsers(data.totalUsers)
                    setLastMonthUsers(data.lastMonthUsers)
                }

            } catch (error) {
                console.log(error.message)
            }
        }
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/getposts?limit=5`)
                const data = await res.json();
                console.log("PostData:", data)
                if (res.ok) {
                    setPOsts(data.posts)
                    setTotalPosts(data.totalPosts)
                    setLastMonthPosts(data.lastMonthPosts)
                }

            } catch (error) {
                console.log(error.message)
            }
        }
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getcomments?limit=5`)
                const data = await res.json();
                console.log("COmmentData:", data)
                if (res.ok) {
                    setComments(data.comments)
                    setTotalComments(data.totalComments)
                    setLastMonthComments(data.lastMonthComments)
                }

            } catch (error) {
                console.log(error.message)
            }
        }

        if (currentUser.isAdmin) {
            fetchUsers();
            fetchPosts();
            fetchComments();
        }

    }, [currentUser])


    return (
        <div className='p-3 ms:mx-auto'>
            <div className='flex-wrap flex justify-center gap-3'>

            <div className='flex flex-col p-3 darl:bg-slate-800 gap-4 md:w-72 w-full rounded-ms shadow-md'>
                <div className='flex justify-between'>
                    <div className=''>
                        <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
                        <p className='text-2xl'>{totalUsers}</p>
                    </div>
                        <HiOutlineUserGroup className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg'/>
                </div>
                    <div className='flex gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'><HiArrowNarrowUp/>{lastMonthUsers}</span>
                       <div className='text-gray-500'>Last Month</div>
                    </div>
            </div>
            <div className='flex flex-col p-3 darl:bg-slate-800 gap-4 md:w-72 w-full rounded-ms shadow-md'>
                <div className='flex justify-between'>
                    <div className=''>
                        <h3 className='text-gray-500 text-md uppercase'>Total Comments</h3>
                        <p className='text-2xl'>{totalComments}</p>
                    </div>
                        <HiAnnotation className='bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg'/>
                </div>
                    <div className='flex gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'><HiArrowNarrowUp/>{lastMonthComments}</span>
                       <div className='text-gray-500'>Last Month</div>
                    </div>
            </div>
            <div className='flex flex-col p-3 darl:bg-slate-800 gap-4 md:w-72 w-full rounded-ms shadow-md'>
                <div className='flex justify-between'>
                    <div className=''>
                        <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
                        <p className='text-2xl'>{totalPosts}</p>
                    </div>
                        <HiDocumentText className='bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg'/>
                </div>
                    <div className='flex gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'><HiArrowNarrowUp/>{lastMonthPosts}</span>
                       <div className='text-gray-500'>Last Month</div>
                    </div>
            </div>
            </div>
            <div className='flex flex-wrap py-3 mx-auto justify-center gap-3'>
                <div className='flex flex-col w-full md:w-auto shadow-md rounded-md p-2 dark:bg-gray-800'>
                    <div className='flex justify-between p-3 text-sm font-semibold'>
                        <h1 className='text-center'>Recent Users</h1>
                        <Button outline gradientDuoTone='purpleToPink'><Link to={'/dashboard?tab=users'}>See all</Link></Button>
                    </div>
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>User Image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                        </Table.Head>
                        {users && users.map((user)=>(
                            <Table.Body key={user._id} className='divide-y'>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>
                                        <img
                                        src={user.profilePhoto}
                                        alt={user.username}
                                        className='w-10 h-10 rounded-full bg-gray-500'
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                       {user.username}
                                    </Table.Cell>

                                </Table.Row>

                            </Table.Body>
                        ))}
                    </Table>
                </div>
                <div className='flex flex-col w-full md:w-auto shadow-md rounded-md p-2 dark:bg-gray-800'>
                    <div className='flex justify-between p-3 text-sm font-semibold'>
                        <h1 className='text-center'>Recent Comments</h1>
                        <Button outline gradientDuoTone='purpleToPink'><Link to={'/dashboard?tab=comments'}>See all</Link></Button>
                    </div>
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>Comment Contnet</Table.HeadCell>
                            <Table.HeadCell>Likes</Table.HeadCell>
                        </Table.Head>
                        {comments && comments.map((comment)=>(
                            <Table.Body key={comment._id} className='divide-y'>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell className='w-96'>
                                       <p className='line-clamp-2'>{comment.content}</p>
                                    </Table.Cell>
                                    <Table.Cell>
                                       {Number(comment.numberOfLikes)}
                                    </Table.Cell>

                                </Table.Row>

                            </Table.Body>
                        ))}
                    </Table>
                </div>
                <div className='flex flex-col w-full md:w-auto shadow-md rounded-md p-2 dark:bg-gray-800'>
                    <div className='flex justify-between p-3 text-sm font-semibold'>
                        <h1 className='text-center'>Recent Posts</h1>
                        <Button outline gradientDuoTone='purpleToPink'><Link to={'/dashboard?tab=posts'}>See all</Link></Button>
                    </div>
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>Post Image</Table.HeadCell>
                            <Table.HeadCell>Post Title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                        </Table.Head>
                        {posts && posts.map((post)=>(
                            <Table.Body key={post._id} className='divide-y'>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>
                                        <img
                                        src={post.image}
                                        alt='user'
                                        className='w-10 h-10 rounded-md bg-gray-500'
                                        />
                                    </Table.Cell>
                                    <Table.Cell className='w-96'>
                                       {post.title}
                                    </Table.Cell>
                                    <Table.Cell className='w-5'>
                                       {post.category}
                                    </Table.Cell>

                                </Table.Row>

                            </Table.Body>
                        ))}
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default DashboardComponent
