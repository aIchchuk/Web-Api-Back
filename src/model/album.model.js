import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
  albumName: {
    type: String,
    required: true,
    unique: true
  },
  artistName: {
    type: String,
    required: true
  },
  albumImage: {
    type: String, // Local file path
    required: false
  },
  albumImageUrl: {
    type: String, // External URL
    required: false
  },
  song: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song"
    }
  ]
}, { timestamps: true });

export const Album = mongoose.model("Album", albumSchema);
