import express from "express";
import {uploadImage} from "../controllers/user-controller.js"
import {updateUser} from "../controllers/user-controller.js" 
import {verifyUser} from "../utils/verifyUser.js"   

const router = express.Router();

router.post('/upload',uploadImage)
router.put('/update/:userId',verifyUser,updateUser)

export default router;