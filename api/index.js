import express from 'express'
import { mongoose } from 'mongoose'
import dotenv from 'dotenv'
import userRoute from './routes/user.route.js'
import authRoute from './routes/auth.route.js'
import postRoute from './routes/post.route.js'
import commentRoute from './routes/comment.route.js'
import cookieParser from 'cookie-parser'
import path from 'path'

const app = express()
app.use(express.json())
app.use(cookieParser())
const __dirname = path.resolve();
dotenv.config()

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})
app.use((err, req, res, next) => {
    const statusCode = err.status || 500
    const message = err.message || 'Internal server error'
    res.status(statusCode).json({
        success : false,
        status : statusCode,
        message: message
    })
    next()
})

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database terhubung')
}).catch((err) => {
    console.log(err)
    console.log('Database tidak terhubung')
})

app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)
app.use('/api/comment', commentRoute)

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`)
})