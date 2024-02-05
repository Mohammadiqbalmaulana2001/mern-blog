import Post from "../models/post.model.js"
import { HandleError } from "../utils/error.js"
export const create = async (req, res, next) => {
    if(!req.user.isAdmin){
        return next(HandleError(res, 401, "Anda bukan admin"))
    }

    if(!req.body.title || !req.body.content){
        return next(HandleError(res, 400, "Judul dan konten harus diisi"))
    }
    
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id
    })
    try {
        const post = await newPost.save()
        res.status(200).json(post)
    } catch (error) {
        next(HandleError(res, 400, error.message))
    }
}