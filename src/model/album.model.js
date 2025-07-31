import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
  albumName: {
     type: String, 
     required: true 
    },
  artistName: {
     type: String, 
     required: true 
    },
  albumImageUrl: {
     type: String, 
     required: true 
    },
  uploadedBy: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'User', 
 
    },
  song: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
}, { timestamps: true });

export const Album = mongoose.model("Album", albumSchema);
