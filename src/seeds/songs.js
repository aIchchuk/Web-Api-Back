import mongoose from "mongoose";
import { config } from "dotenv";
import { Song } from "../model/song.model.js";

// image path = front/public/cover-images
// audio path = front/public/songs

config();

const songs = [
	{
		songName: "Stay With Me",
		artistName: "Sarah Mitchell",
		songImageUrl: "/cover-images/1.jpg",
		audioUrl: "/songs/1.mp3",
	},
	{
		songName: "Midnight Drive",
		artistName: "The Wanderers",
		songImageUrl: "/cover-images/2.jpg",
		audioUrl: "/songs/2.mp3",
	},
	{
		songName: "Lost in Tokyo",
		artistName: "Electric Dreams",
		songImageUrl: "/cover-images/3.jpg",
		audioUrl: "/songs/3.mp3",
	},
	{
		songName: "Summer Daze",
		artistName: "Coastal Kids",
		songImageUrl: "/cover-images/4.jpg",
		audioUrl: "/songs/4.mp3",
	},
	{
		songName: "Neon Lights",
		artistName: "Night Runners",
		songImageUrl: "/cover-images/5.jpg",
		audioUrl: "/songs/5.mp3",
	},
	{
		songName: "Mountain High",
		artistName: "The Wild Ones",
		songImageUrl: "/cover-images/6.jpg",
		audioUrl: "/songs/6.mp3",
	},
	{
		songName: "City Rain",
		artistName: "Urban Echo",
		songImageUrl: "/cover-images/7.jpg",
		audioUrl: "/songs/7.mp3",
	},
	{
		songName: "Desert Wind",
		artistName: "Sahara Sons",
		songImageUrl: "/cover-images/8.jpg",
		audioUrl: "/songs/8.mp3",
	},
	{
		songName: "Ocean Waves",
		artistName: "Coastal Drift",
		songImageUrl: "/cover-images/9.jpg",
		audioUrl: "/songs/9.mp3",
	},
	{
		songName: "Starlight",
		artistName: "Luna Bay",
		songImageUrl: "/cover-images/10.jpg",
		audioUrl: "/songs/10.mp3",
	},
	{
		songName: "Winter Dreams",
		artistName: "Arctic Pulse",
		songImageUrl: "/cover-images/11.jpg",
		audioUrl: "/songs/11.mp3",
	},
	{
		songName: "Purple Sunset",
		artistName: "Dream Valley",
		songImageUrl: "/cover-images/12.jpg",
		audioUrl: "/songs/12.mp3",
	},
	{
		songName: "Neon Dreams",
		artistName: "Cyber Pulse",
		songImageUrl: "/cover-images/13.jpg",
		audioUrl: "/songs/13.mp3",
	},
	{
		songName: "Moonlight Dance",
		artistName: "Silver Shadows",
		songImageUrl: "/cover-images/14.jpg",
		audioUrl: "/songs/14.mp3",
	},
	{
		songName: "Urban Jungle",
		artistName: "City Lights",
		songImageUrl: "/cover-images/15.jpg",
		audioUrl: "/songs/15.mp3",
	},
	{
		songName: "Crystal Rain",
		artistName: "Echo Valley",
		songImageUrl: "/cover-images/16.jpg",
		audioUrl: "/songs/16.mp3",
	},
	{
		songName: "Neon Tokyo",
		artistName: "Future Pulse",
		songImageUrl: "/cover-images/17.jpg",
		audioUrl: "/songs/17.mp3",
	},
	{
		songName: "Midnight Blues",
		artistName: "Jazz Cats",
		songImageUrl: "/cover-images/18.jpg",
		audioUrl: "/songs/18.mp3",
	},
];

const seedSongs = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		await Song.deleteMany();

		for (const song of songs) {
			try {
				await Song.create(song);
				console.log(`✅ Created: ${song.songName}`);
			} catch (error) {
				console.error(`❌ Failed for "${song.songName}": ${error.message}`);
			}
		}

		console.log("✅ Songs seeded successfully!");
	} catch (error) {
		console.error("❌ Error seeding songs:", error);
	} finally {
		await mongoose.disconnect();
	}
};

seedSongs();
