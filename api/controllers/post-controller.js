import Post from "../models/post-model.js";
import { errorHandler } from "../utils/error.js"
import cloudinary from "../../cloudinaryConfig.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");

export const create = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "you are not allowed to create a post"))

    }
    console.log(req.body)
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, "Please provide all required fields"))
    }
    const slug = req.body.title
        .toLowerCase()                           // Convert to lowercase
        .trim()                                   // Remove leading/trailing spaces
        .replace(/\s+/g, '-')                     // Replace spaces with '-'
        .replace(/[^a-z0-9-]/g, '')               // Remove non-alphanumeric except '-'
        .replace(/-+/g, '-');                     // Replace multiple dashes with a single one

    const newPost = new Post({
        ...req.body, slug, userId: req.user.id
    });
    try {
        const savedPost = await newPost.save();
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

            res.json({ imageUrl: uploadResult.secure_url });
        } catch (error) {
            console.error("Upload failed:", error.message || error);
            res.status(500).json({ error: "Upload failed: " + (error.message || error) });
        }
    });
};

export const getPosts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        // Construct filters for querying posts
        const filters = {};
        if (req.query.userId) filters.userId = req.query.userId;
        if (req.query.category) filters.category = req.query.category;
        if (req.query.slug) filters.slug = req.query.slug;
        if (req.query.postId) filters._id = req.query.postId;
        if (req.query.searchTerm) {
            filters.$or = [
                { title: { $regex: req.query.searchTerm, $options: 'i' } },
                { content: { $regex: req.query.searchTerm, $options: 'i' } },
            ];
        }

        // Fetch posts based on filters
        const posts = await Post.find(filters)
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        // Get total number of posts (without filters)
        const totalPosts = await Post.countDocuments();

        // Calculate last month's posts
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        // Return the response
        res.status(200).json({
            posts,
            filteredTotal: await Post.countDocuments(filters), // Total posts after filters
            totalPosts, // Total posts without filters
            lastMonthPosts
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const deleteposts = async(req,res,next)=>{
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
        return next(errorHandler(403,"You are not allowed to delete this post"))
    }
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json('The post has been deleted successfully');
    } catch (error) {
        nex(error)
    }
}