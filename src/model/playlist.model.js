import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    playlistName: {
        type: String,
        required: true
    },
    playlistImage: {
        type: String,  // local file path
        required: false,
        unique: false
    },
    playlistImageUrl: {
        type: String,  // external url
        required: false,
        unique: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

export const Playlist = mongoose.model('Playlist', playlistSchema);
