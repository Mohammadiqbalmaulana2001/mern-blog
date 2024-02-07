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

export const getposts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 10
        const sortDirection = req.query.order === 'asc' ? 1 : -1
        const post = await Post.find({
            ...(req.query.userId && {userId: req.query.userId}),
            ...(req.query.category && {category: req.query.category}),
            ...(req.query.slug && {slug: req.query.slug}),
            ...(req.query.postId && {_id: req.query.postId}),
            ...(req.query.searchTerm && {
                $or: [
                    {title: {$regex: req.query.searchTerm, $options: 'i'}},
                    {content: {$regex: req.query.searchTerm, $options: 'i'}}
                ]
            })
        }).sort({updateAt: sortDirection}).skip(startIndex).limit(limit)
        const totalPost = await Post.countDocuments()
        const now = new Date()
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )

        const LastMonthPost = await Post.countDocuments({
            createdAt: {
                $gte: oneMonthAgo
            }
        })
        res.status(200).json({post, totalPost, LastMonthPost})
    } catch (error) {
        next(HandleError(res, 400, error.message))
    }
}

export const deletepost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'kamu tidak bisa menghapus postingan ini'));
        }
        try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json('postingan berhasil di hapus');
        } catch (error) {
        next(error);
        }
    };


    export const updatepost = async (req, res, next) => {
        if (!req.user.isAdmin || req.user.id !== req.params.userId) {
          return next(errorHandler(403, 'Anda tidak diperbolehkan memperbarui postingan ini'));
        }
        try {
          const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            {
              $set: {
                title: req.body.title,
                content: req.body.content,
                category: req.body.category,
                image: req.body.image,
              },
            },
            { new: true }
          );
          res.status(200).json(updatedPost);
        } catch (error) {
          next(error);
        }
      };