import express from "express";
import uploadImage from "../controllers/user-controller.js"


const router = express.Router();

router.post('/upload',uploadImage)

export default router;