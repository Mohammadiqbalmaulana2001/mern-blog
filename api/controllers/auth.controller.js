import User from "../models/user.model.js"
import bcrptyjs from 'bcryptjs'
import { HandleError } from "../utils/error.js"
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body
    
    if(!username || !email || !password || username == '' || email == '' || password == ''){
        return next(HandleError(res, 400, "isi semua kolom"))
    }
    
    const hash = await bcrptyjs.hash(password, 10)

    const newUser = new User({
        username,
        email,
        password: hash
    })

    try {
        await newUser.save()
        res.json( 'Data telah berhasil di tambahkan' )
    } catch (error) {
        return next(HandleError(res, 400, error.message))
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body

    if(!email || !password || email == '' || password == ''){
        return next(HandleError(res, 400, "isi semua kolom"))
    }

    try {
        const validUser = await User.findOne({ email })
        if (!validUser) {
            return next(HandleError(res, 404, "email tidak ditemukan"))
        }
        const validPassword = bcrptyjs.compareSync(password, validUser.password)
        if(!validPassword) {
            return next(HandleError(res, 400, "password tidak sesuai"))
        }
        const token = jwt.sign({  id: validUser._id} , process.env.JWT_SECRET)

        const { password: pass, ...rest } = validUser._doc

        res.status(200).cookie("access_token", token, {
            httpOnly: true
        }).json(rest)
    } catch (error) {
        next(HandleError(res, 404, error.message))
    }
}