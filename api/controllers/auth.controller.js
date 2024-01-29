import User from "../models/user.model.js"
import bcrptyjs from 'bcryptjs'
import { HandleError } from "../utils/error.js"
export const signup = async (req, res, next) => {
    const { username, email, password } = req.body
    
    if(!username || !email || !password || username == '' || email == '' || password == ''){
        next(HandleError(res, 400, "isi semua kolom"))
    }
    
    const hash = await bcrptyjs.hash(password, 10)

    const newUser = new User({
        username,
        email,
        password: hash
    })

    try {
        await newUser.save()
        res.json( 'User created' )
    } catch (error) {
        next(HandleError(res, 400, error.message))
    }
}