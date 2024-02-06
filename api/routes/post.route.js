import express from "express"
import { verifyUser } from "../utils/verifyUser.js"
import { create, deletepost, getposts } from "../controllers/post.controller.js"

const router = express.Router()

router.post('/create',verifyUser, create )
router.get('/getposts', getposts)
router.delete('/deletepost/:postId/:userId',verifyUser, deletepost)

export default router