import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import React, { useRef, useState, useEffect } from 'react'
import { useSelector } from "react-redux"
import {Link} from "react-router-dom"
import {
  updateStart, updateFailure, updateSuccess, deleteUserStart, deleteUserSuccess, deleteUserfailure, signoutSuccess

} from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { HiOutlineExclamationCircle } from 'react-icons/hi'


const DashProfile = () => {
  const { currentUser, error,loading } = useSelector((state) => state.user)
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(currentUser.profilePhoto);
  const [imageFileUploaderror, setImageFileUploaderror] = useState(null);
  const [ImageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showmodel, setShowmodel] = useState(false);
  const fileRef = useRef();
  const dispatch = useDispatch();


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileURL(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage(imageFile);
    }
  }, [imageFile]);

  // Uploading Image to cloudinary via backend
  const uploadImage = async (file) => {
    if (!file) return;
    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      console.error("Invalid file format. Please upload an image.");
      setImageFileUploaderror("Invalid file format. Please upload an image.");
      return;
    }
    // Check file size (optional, e.g., limit to 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error("File size exceeds the 5MB limit.");
      setImageFileUploaderror("File size exceeds the 5MB limit.");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);

    try {
      setImageUploading(true);
      const response = await fetch("/api/user/upload", {
        method: "POST",
        body: formData,

      });
      const data = await response.json();
      if (response.ok) {
        setImageFileURL(data.imageUrl); // Update profile image URL after upload
        setImageUploading(false);
        setFormData({ ...formData, profilePhoto: data.imageUrl });
        console.log("Image uploaded successfully:", data.imageUrl);
      } else {
        console.error("Image upload failed:", data.error);
        imageFileUploaderror("Image upload failed:", data.error);
        setImageFile(null);
        setImageFileURL(null);
        setImageUploading(false);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    if (ImageUploading) {
      setUpdateUserError("Image is still uploading. Please wait");
      return;
    }
    try {
      dispatch(updateStart());
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  }
  const handleDeleteUser = async () => {
    setShowmodel(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserfailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));

      }
    } catch (error) {
      dispatch(deleteUserfailure(error.message));
    }
  };
  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(error.message)
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='file' accept='image/*' onChange={handleImageChange} ref={fileRef} hidden />

        <div className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => fileRef.current.click()}>
          <img
            src={imageFileURL || currentUser.profilePhoto}
            alt='user'
            className='rounded-full w-full h-full object-cover border-8 border-[lightgray]'
          />
        </div>

        {imageFileUploaderror &&
          <Alert color='failure' className='text-center'>
            {imageFileUploaderror}
          </Alert>
        }

        <TextInput type='text' id='username' placeholder='Username' defaultValue={currentUser.username} onChange={handleChange} />
        <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email} onChange={handleChange} />
        <TextInput type='password' id='password' placeholder='Password' onChange={handleChange} />

        <Button type='submit' gradientDuoTone='purpleToBlue' outline disabled={loading || ImageUploading}>{loading ? "loading..." : "update"}</Button>
        {
          currentUser.isAdmin && (
            <Link to={'/create-post'}>

              <Button type='button' gradientDuoTone='purpleToPink' className='w-full'>
                Create a post
              </Button>
            </Link>

          )




        }
      </form>

      <div className='text-red-500 flex justify-between mt-2'>
        <span onClick={() => setShowmodel(true)} className='cursor-pointer'>Delete Account</span>
        <span onClick={handleSignout} className='cursor-pointer'>Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert color='success' className='text-center'>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='text-center'>
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color='failure' className='text-center'>
          {error}
        </Alert>
      )}
      <Modal show={showmodel} onClose={() => setShowmodel(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="text-5xl text-gray-500 dark:text-gray-200 mb-4 mx-auto" />
            <h3>Are you sure you want to delete your account?</h3>
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

export default DashProfile;
