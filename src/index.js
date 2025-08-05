// index.js
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
import searchRoutes from "./routes/search.route.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/songs', express.static(path.join(__dirname, 'public/songs')));
app.use('/cover-images', express.static(path.join(__dirname, 'public/cover-images')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/song', songRoutes);
app.use('/album', albumRoutes);
app.use('/playlist', playlistRoutes);
app.use('/stat', statRoutes);
app.use('/search', searchRoutes);

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message });
});

// Export app for testing
export default app;

// Only listen if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    connectDB();
    console.log("Server is running on port " + PORT);
  });
}
