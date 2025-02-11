import { Button, TextInput } from 'flowbite-react'
import React, { useRef, useState, useEffect } from 'react'
import { useSelector } from "react-redux"

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(currentUser.profilePhoto);
  const fileRef = useRef();

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

  const uploadImage = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/user/upload", {  
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setImageFileURL(data.imageUrl); // Update profile image URL after upload
        console.log("Image uploaded successfully:", data.imageUrl);
      } else {
        console.error("Image upload failed:", data.error);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input type='file' accept='image/*' onChange={handleImageChange} ref={fileRef} hidden />
        
        <div className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => fileRef.current.click()}>
          <img 
            src={imageFileURL || currentUser.profilePhoto} 
            alt='user' 
            className='rounded-full w-full h-full object-cover border-8 border-[lightgray]' 
          />
        </div>

        <TextInput type='text' id='username' placeholder='Username' defaultValue={currentUser.username} />
        <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email} />
        <TextInput type='password' id='password' placeholder='Password' />
        
        <Button type='submit' gradientDuoTone='purpleToBlue' outline>Update</Button>
      </form>

      <div className='text-red-500 flex justify-between'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}

export default DashProfile;
