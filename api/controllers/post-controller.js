import Post from "../models/post-model.js";
import { errorHandler } from "../utils/error.js"
import cloudinary from "../../cloudinaryConfig.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");

export const create = async (req,res,next)=>{
    if(!req.user.isAdmin){
        return next(errorHandler(403,"you are not allowed to create a post"))

    }
    console.log(req.body)
    if(!req.body.title || !req.body.content){
        return next(errorHandler(400,"Please provide all required fields"))
    }
    const slug = req.body.title.split('').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g,'');
    const newPost = new Post({
        ...req.body,slug,userId:req.user.id
    });
    try {
        const savedPost = await  newPost.save();
        res.status(200).json(savedPost)
    } catch (error) {
        next(error)
    }
}

export const uploadImage = async (req, res) => {
  console.log("Received request for image upload");

  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err.message);
      return res.status(400).json({ error: "Multer error: " + err.message });
    }

    if (!req.file) {
      console.warn("No file uploaded by user");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File received:", req.file.originalname);
    console.log("Uploading image to Cloudinary...");

    try {
      // Ensure the file buffer exists
      if (!req.file.buffer) {
        throw new Error("File buffer is empty");
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "post_images" },
          (error, uploadedImage) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(new Error("Cloudinary upload failed: " + error.message));
            } else {
              console.log("Upload successful:", uploadedImage.secure_url);
              resolve(uploadedImage);
            }
          }
        );
        uploadStream.end(req.file.buffer);
      });

      res.json({imageUrl: uploadResult.secure_url });
    } catch (error) {
      console.error("Upload failed:", error.message || error);
      res.status(500).json({ error: "Upload failed: " + (error.message || error) });
    }
  });
};