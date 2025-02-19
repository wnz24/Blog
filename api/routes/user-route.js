import express from "express";
import {uploadImage} from "../controllers/user-controller.js"
import {updateUser} from "../controllers/user-controller.js" 
import {verifyUser} from "../utils/verifyUser.js"  
import {deleteUser} from "../controllers/user-controller.js"     

const router = express.Router();

router.post('/upload',uploadImage)
router.put('/update/:userId',verifyUser,updateUser)
router.delete('/delete/:userId',verifyUser,deleteUser)

export default router;