import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
	songName: {
		type: String,
		required: true,
		unique: true,
	},
	artistName: {
		type: String,
		required: true,
	},
	songImage: {
		type: String,
		required: false,
	},
	songImageUrl: {
		type: String,
		required: false,
	},
	audioFile: {
		type: String,
		required: false, // ✅ No unique constraint here
	},
	audioUrl: {
		type: String,
		required: false,
	},
	albumName: {
		type: String,
		required: false,
	},
}, { timestamps: true });

export const Song = mongoose.model("Song", songSchema);
