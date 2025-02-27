import express from "express";
import {verifyUser} from "../utils/verifyUser.js"
import { create,getPosts, updatepost } from "../controllers/post-controller.js";
import { uploadImage } from "../controllers/post-controller.js";
import { deleteposts } from "../controllers/post-controller.js";
 const router = express.Router();

 router.post('/create',verifyUser, create);
 router.post('/upload',uploadImage)
 router.get('/getposts',getPosts)
 router.delete('/deletepost/:postId/:userId',verifyUser,deleteposts)
 router.put('/updatepost/:postId/:userId',verifyUser,updatepost)


 export default router