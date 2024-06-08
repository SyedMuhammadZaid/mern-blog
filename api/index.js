import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'

const app = express();
app.use(express.json());

dotenv.config();
mongoose.connect(process.env.MONGO).then(() => console.log('db is connected'))

// Routes
app.use('/api/user' , userRouter);
app.use('/api/auth', authRouter)


app.listen(3000, () => {
    console.log('server is listening to port 3000')
})
