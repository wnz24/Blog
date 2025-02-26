import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import userRoutes from './routes/user-route.js'
import authRoutes from './routes/auth-route.js'
import postRoutes from './routes/post-route.js'
import cookieParser from "cookie-parser";   

dotenv.config();

mongoose.connect(process.env.MONGOURL).then(() => {
    console.log("MongoDB is connected")
})
const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
    console.log("server is running on port 3000!");
})


app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/post', postRoutes)

app.use((err, req, res, next) => {
    console.error("Error:", err); // Debugging log
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});
