import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    playlistName: {
        type: String,
        required: true,
    },
    playlistImage: {
        type: String,  // local file path
        required: false,
    },
    playlistImageUrl: {
        type: String,  // external url
        required: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    songs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Song",
        }
    ],
    public: { 
        type: Boolean, 
        default: false 
    },
}, { timestamps: true });

export const Playlist = mongoose.model('Playlist', playlistSchema);
