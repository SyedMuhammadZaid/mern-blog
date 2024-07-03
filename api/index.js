import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import postRouter from "./routes/post.route.js"
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

dotenv.config();
mongoose.connect(process.env.MONGO).then(() => console.log("db is connected"));

// Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/post",postRouter)


app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({
    statusCode,
    success: false,
    message,
  });
});


app.listen(3000, () => {
  console.log("server is listening to port 3000");
});
