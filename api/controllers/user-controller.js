import cloudinary from "../../cloudinaryConfig.js";
import multer from "multer";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import {errorHandler} from "../utils/error.js";
import User from "../models/user-model.js";
dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");

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
          { folder: "profile_pictures" },
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


export const updateUser = async (req, res, next) => {
  const { userId } = req.params;

  if (userId !== req.user.id) {
    return next(errorHandler(401, "Unauthorized"));
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }

  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(errorHandler(400, "Username must be at least 7 and at most 20 characters"));
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username must be lowercase"));
    }
    if (req.body.username.match(/[^a-z0-9]/)) {
      return next(errorHandler(400, "Username must contain only lowercase letters and numbers"));
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePhoto: req.body.profilePhoto,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    console.log(error);
    return next(errorHandler(500, "Internal server error"));
  }
};
