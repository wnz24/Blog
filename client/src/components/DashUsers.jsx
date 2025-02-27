import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux"
import { Button, Modal, Table } from "flowbite-react"
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { FaCheck,FaTimes  } from "react-icons/fa";
const DashUsers = () => {
    const { currentUser } = useSelector((state) => state.user)
    const [users, setUsers] = useState([])
    const [showMore, setShowMore] = useState(true);
    const [showmodel, setShowmodel] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState('')
  
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const res = await fetch('/api/user/getusers')
          const data = await res.json();
          if (res.ok) {
            setUsers(data.users)
            if (data.users.length < 9) {
              setShowMore(false)
            }
          }
          console.log("posts:", data)
        } catch (error) {
          console.log(error.message)
        }
      }
      if (currentUser.isAdmin) {
        fetchUsers();
      }
    }, [currentUser?._id])
   
    const handleShowMore = async () => {
      const startIndex = users.length;
      try {
        const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`)
        const data = await res.json();
        if (res.ok) {
          setUsers((prev) => [...prev, ...data.users])
          if (data.users.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
  
    const handleDeleteUser = async () => {
        console.log("Delete User")
    //   setShowmodel(false);
    //   try {
    //      const res = await fetch(`/api/user/deleteuser/${userIdToDelete}/${currentUser._id}`,
    //       {method: 'DELETE'}
    //      );
    //      const data = await res.json();
    //      if(!res.ok){
    //       console.log(data.message)
    //      }else{
    //       setUsers((prev)=>{
    //         prev.filter((user)=> user._id !== postId)
    //       })
    //      }
         
    //   } catch (error) {
    //     console.log(error.message)
    //   }
    }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500' >
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell  >Delete</Table.HeadCell>
              
            </Table.Head>
            {users.map((user) => (
              <Table.Body className='divide-y'  key={user._id}>
             
                <Table.Row  className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    
                      <img
                        src={user.profilePhoto}
                        alt={user.username}
                        className='w-10 h-10 object-cover  rounded-full bg-gray-500'
                      />
                   

                  </Table.Cell>
                  <Table.Cell>
                   {user.username}
                  </Table.Cell>
                  <Table.Cell>
                    {user.email}
                  </Table.Cell>

                  <Table.Cell>
                    {user.isAdmin ? (<FaCheck className='text-green-500'/>) : (<FaTimes className='text-red-500'/>)}
                  </Table.Cell>
                  <Table.Cell>
                    <span className='font-medium text-red-500 hover:underline cursor-pointer' onClick={() => {
                setShowmodel(true);
                setUserIdToDelete(user._id);
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

      ) :
        (
          <p>
            You have no users yet!
          </p>

        )}
      <Modal show={showmodel} onClose={() => setShowmodel(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="text-5xl text-gray-500 dark:text-gray-200 mb-4 mx-auto" />
            <h3>Are you sure you want to delete this user?</h3>
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

export default DashUsers
