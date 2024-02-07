import express from 'express'
import { verifyUser } from "../utils/verifyUser.js"
import { createcomment, getPostComments } from '../controllers/comment.controller.js'

const router = express.Router()

router.post('/create',verifyUser, createcomment)
router.get('/getPostComments/:postId', verifyUser, getPostComments)

export default router