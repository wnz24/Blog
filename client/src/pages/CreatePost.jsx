import React, { useState,useEffect } from "react";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import categories from "../util/Categories";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules, formats } from "../util/QuillConfig";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const CreatePost = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [publisherror, setPublisherror] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "uncategorized",
    content: "",
    image: imageFile,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleUploadImage = async () => {
    if (!imageFile) return;

    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    const fileExtension = imageFile.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      setImageFileUploadError("Invalid file format. Please upload an image.");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (imageFile.size > maxSize) {
      setImageFileUploadError("File size exceeds the 5MB limit.");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("image", imageFile);

    try {
      setImageUploading(true);
      const response = await fetch("/api/post/upload", {
        method: "POST",
        body: uploadData,
      });
      const data = await response.json();

      if (response.ok) {
        setFormData((prev) => ({ ...prev, image: data.imageUrl }));
        setImageUploading(false);
      } else {
        setImageFileUploadError("Image upload failed.");
        setImageUploading(false);
      }
    } catch (error) {
      setImageFileUploadError("Image upload failed.");
      setImageUploading(false);
    }
  };

  useEffect(() => {
    console.log("Publish Error Updated:", publisherror);
  }, [publisherror]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/post/create", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        setPublisherror(data.message)
        return
      } 
      if(res.ok) {
        setPublisherror(null)
        navigate(`/post/${data.slug}`)
      }
    } catch (error) {

      setPublisherror(error.message)
    }
    console.log("Post Data:", formData);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            value={formData.title}
            onChange={handleChange}
          />
          <Select id="category" value={formData.category} onChange={handleChange}>
            <option value="uncategorized">Select a category</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex items-center gap-4 border border-teal-500 border-dotted p-3 rounded">
          <FileInput type="file" accept="image/*" onChange={handleFileChange} />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploading}
          >
            {imageUploading ? "Uploading..." : "Upload Image"}
          </Button>
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}

        {imageFileUploadError && <p className="text-red-500 text-sm">{imageFileUploadError}</p>}

        <ReactQuill
          theme="snow"
          placeholder="Write something amazing..."
          className="h-72 mb-12"
          value={formData.content}
          onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
          modules={modules}
          formats={formats}
        />

        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
        {publisherror && (
          <Alert
          color="failure" className="mt-5">
          {publisherror}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
