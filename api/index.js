import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'

const app = express();
dotenv.config();
mongoose.connect(process.env.MONGO).then(() => console.log('db is connected'))

// Routes
app.use('/api/user' , userRouter)


app.listen(3000, () => {
    console.log('server is listening to port 3000')
})
