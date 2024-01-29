import express from 'express'
import { mongoose } from 'mongoose'
import dotenv from 'dotenv'
import userRoute from './routes/user.route.js'

const app = express()
app.use(express.json())
dotenv.config()

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

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`)
})