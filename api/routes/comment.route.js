import express from 'express'
import { verifyUser } from "../utils/verifyUser.js"
import { createcomment } from '../controllers/comment.controller.js'

const router = express.Router()

router.post('/create',verifyUser, createcomment)

export default router