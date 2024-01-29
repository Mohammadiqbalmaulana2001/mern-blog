import User from "../models/user.model.js"
import bcrptyjs from 'bcryptjs'
export const signup = async (req, res) => {
    const { username, email, password } = req.body
    
    if(!username || !email || !password || username == '' || email == '' || password == ''){
        return res.status(400).json({ message: 'Silakan isi semua kolom' })
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
        res.status(500).json({ message: error.message })
    }
}