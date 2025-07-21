import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./lib/db.js";

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import playlistRoutes from "./routes/playlist.route.js";
import statRoutes from "./routes/stat.route.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors({
  origin: "http://localhost:5173", // Your frontend URL
  credentials: true, // Allow cookies, auth headers, etc.
}));
app.use(express.json()); // to parse req.body
app.use(express.urlencoded({ extended: true }));



// ✅ Serve static files from public
app.use('/songs', express.static(path.join(__dirname, 'public/songs')));
app.use('/cover-images', express.static(path.join(__dirname, 'public/cover-images')));



app.use('/uploads', express.static('uploads'));
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/song', songRoutes);
app.use('/album', albumRoutes);
app.use('/playlist', playlistRoutes);
app.use('/stat', statRoutes)


// error handler
app.use((err, req, res, next) => {
    res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message });
});



app.listen(PORT, () => {
    connectDB();
    console.log("Server is running on port " + PORT);
    
});


// todo: socket.io

