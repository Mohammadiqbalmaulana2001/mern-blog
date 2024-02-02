import jwt from 'jsonwebtoken'
import  {HandleError}  from './error.js'

export const verifyUser = (req, res, next) => {
    const token = req.cookies.access_token
    if(!token){
        return next(HandleError(res, 401, "unauthorized"))
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err){
            return next(HandleError(res, 401, "unauthorized"))
        }
        req.user = user
        next()
    })
}