import express from 'express'
import { verifyUser } from "../utils/verifyUser.js"
import { createcomment, editComment, getPostComments, likeComment } from '../controllers/comment.controller.js'

const router = express.Router()

router.post('/create',verifyUser, createcomment)
router.get('/getPostComments/:postId', verifyUser, getPostComments)
router.put('/likeComment/:commentId', verifyUser , likeComment )
router.put('/editComment/:commentId', verifyUser , editComment )

export default router