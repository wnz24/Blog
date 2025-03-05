import express from 'express';
import { createComment } from '../controllers/comment-controller.js';
import { verifyUser } from '../utils/verifyUser.js';
import { Router } from 'express';
import { getPostComments } from '../controllers/comment-controller.js';
import { likeComment } from '../controllers/comment-controller.js';
const router = express.Router();

router.post('/create',verifyUser, createComment)
router.get('/getPostComments/:postId',getPostComments)
router.put('/likeComment/:commentId',verifyUser,likeComment)

export default router