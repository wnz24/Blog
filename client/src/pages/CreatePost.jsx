import React, { useState } from "react";
import { Button, FileInput, Select, TextInput } from "flowbite-react";
import categories from "../util/Categories";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules, formats } from "../util/QuillConfig"; // Import Configurations

const CreatePost = () => {
  const [postData, setPostData] = useState({
    title: "",
    category: "uncategorized",
    content: "",
    image: null,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setPostData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    setPostData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Post Data:", postData);
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
            value={postData.title}
            onChange={handleChange}
          />
          <Select id="category" value={postData.category} onChange={handleChange}>
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
          <Button type="button" gradientDuoTone="purpleToBlue" size="sm" outline>
            Upload Image
          </Button>
        </div>

        {/* ReactQuill Editor with Imported Configurations */}
        <ReactQuill
          theme="snow"
          placeholder="Write something amazing..."
          className="h-72 mb-12"
          value={postData.content}
          onChange={(content) => setPostData((prev) => ({ ...prev, content }))}
          modules={modules}
          formats={formats}
        />

        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
