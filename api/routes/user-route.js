import express from "express";
import {uploadImage,updateUser,deleteUser,signout} from "../controllers/user-controller.js"
import {verifyUser} from "../utils/verifyUser.js"  
const router = express.Router();

router.post('/upload',uploadImage)
router.put('/update/:userId',verifyUser,updateUser)
router.delete('/delete/:userId',verifyUser,deleteUser)
router.post('/signout',signout)

export default router;