import express from 'express'
import { verifyUser } from "../utils/verifyUser.js"
import { createcomment, deleteComment, editComment, getPostComments, getcomments, likeComment } from '../controllers/comment.controller.js'

const router = express.Router()

router.post('/create',verifyUser, createcomment)
router.get('/getPostComments/:postId', verifyUser, getPostComments)
router.put('/likeComment/:commentId', verifyUser , likeComment )
router.put('/editComment/:commentId', verifyUser , editComment )
router.delete('/deleteComment/:commentId', verifyUser , deleteComment)
router.get('/getcomments', verifyUser, getcomments);

export default router