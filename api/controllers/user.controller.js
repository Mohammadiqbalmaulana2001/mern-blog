import bcrptyjs from 'bcryptjs'
import { HandleError } from '../utils/error.js'
import User from '../models/user.model.js'
export const test = (req, res) => {
    res.json({ message: 'test' })
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(HandleError(res, 401, "Anda tidak diperbolehkan memperbarui pengguna ini"))
    } 
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(HandleError(res, 400, "Kata sandi minimal harus 6 karakter"))
        }
        req.body.password = bcrptyjs.hashSync(req.body.password, 10)
    }
    if (req.body.username){
            if (req.body.username.length < 7 || req.body.username.length > 20) {
                return next(HandleError(res, 400, "Username minimal 7 dan maksimal 20 karakter"))
            }
            if(req.body.username.includes(" ")){
                return next(HandleError(res, 400, "Username tidak boleh mengandung spasi"))
            }
            if(req.body.username !== req.body.username.toLowerCase()){
                return next(HandleError(res, 400, "Username harus berupa huruf kecil"))
            }
            if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
                return next(HandleError(res, 400, "Username hanya boleh berisi huruf dan angka"))
            }
        }
        try {
            const updateUser = await User.findByIdAndUpdate(req.params.userId, {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    profilePicture: req.body.profilePicture,
                    password: req.body.password
                }
            }, { new: true })
            const { password: pass, ...rest } = updateUser._doc
            res.status(200).json(rest)
        } catch (error) {
            next(HandleError(res, 400, error.message))
        }
}

export const deleteUser = async (req, res, next) => {
    if(!req.user.isAdmin && req.user.id !== req.params.userId){
        return next(HandleError(res, 401, "Anda tidak diperbolehkan menghapus pengguna ini"))
    }
    try {
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json("Pengguna berhasil dihapus")
    } catch (error) {
        next(HandleError(res, 400, error.message))
    }
}

export const signout = async (req, res, next) => {
    try {
        res.clearCookie("access_token").status(200).json("Anda telah keluar")
    } catch (error) {
        next(HandleError(res, 400, error.message))
    }
}

export const getusers = async (req, res, next) => {
    if(!req.user.isAdmin){
        return next(HandleError(res, 401, "Anda tidak diperbolehkan melihat semua pengguna"))
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 10
        const sortDirection = req.query.order === 'asc' ? 1 : -1

        const users = await User.find().sort({createdAt: sortDirection}).skip(startIndex).limit(limit)
        
        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc
            return rest
        })

        const totalUsers = await User.countDocuments()
        const now = new Date()
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )
        const lastMonthUsers = await User.countDocuments({
            createdAt:{$gte: oneMonthAgo}
        })
        
        res.status(200).json({
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers
        })
    } catch (error) {
        next(HandleError(res, 400, error.message))
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId)
        if(!user){
            return next(HandleError(res, 404, "Pengguna tidak ditemukan"))
        }
        const { password, ...rest } = user._doc
        res.status(200).json(rest)
    } catch (error) {
        next(HandleError(res, 400, error.message))
    }
}