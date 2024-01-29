import express from 'express'
import { mongoose } from 'mongoose'
import dotenv from 'dotenv'

const app = express()
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

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`)
})