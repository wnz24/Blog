import express from "express";
import {verifyUser} from "../utils/verifyUser.js"
import { create } from "../controllers/post-controller.js";
import { uploadImage } from "../controllers/post-controller.js";

 const router = express.Router();

 router.post('/create',verifyUser, create);
 router.post('/upload',uploadImage)


 export default router