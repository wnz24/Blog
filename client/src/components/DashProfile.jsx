import { Alert, Button, TextInput } from 'flowbite-react'
import React, { useRef, useState, useEffect } from 'react'
import { useSelector } from "react-redux"
import { updateStart,updateFailure,updateSuccess } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(currentUser.profilePhoto);
  const [imageFileUploaderror, setImageFileUploaderror] = useState(null);
  const [ImageUploading,setImageUploading] = useState(false);
  const [formData,setFormData] = useState({});
  const [updateUserSuccess,setUpdateUserSuccess] = useState(null);
  const [updateUserError,setUpdateUserError] = useState(null);
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
        setFormData({...formData, profilePhoto: data.imageUrl});
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
    setFormData({...formData, [e.target.id]: e.target.value});
  };
  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(Object.keys(formData).length === 0){
      setUpdateUserError("No changes made");
      return;
    }
    if(ImageUploading){
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
      if(!response.ok){
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      }else{
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message)); 
      setUpdateUserError(error.message);
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

        <Button type='submit' gradientDuoTone='purpleToBlue' outline>Update</Button>
      </form>

      <div className='text-red-500 flex justify-between mt-2'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
      {updateUserSuccess &&(
        <Alert color='success' className='text-center'>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError &&(
        <Alert color='failure' className='text-center'>
          {updateUserError}
        </Alert>
      )}
    </div>
  )
}

export default DashProfile;
