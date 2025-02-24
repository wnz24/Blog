import express from "express";
import {verifyUser} from "../utils/verifyUser.js"
import { create,getPosts } from "../controllers/post-controller.js";
import { uploadImage } from "../controllers/post-controller.js";

 const router = express.Router();

 router.post('/create',verifyUser, create);
 router.post('/upload',uploadImage)
 router.get('/getposts',getPosts)


 export default router