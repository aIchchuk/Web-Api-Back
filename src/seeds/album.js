import mongoose from "mongoose";
import { config } from "dotenv";
import { Song } from "../model/song.model.js";
import { Album } from "../model/album.model.js";

config();

const seedDatabase = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);

		// Clear existing data
		await Album.deleteMany({});
		await Song.deleteMany({});

		// First, create all songs
		const createdSongs = await Song.insertMany([
			{
				songName: "City Rain",
				artistName: "Urban Echo",
				songImageUrl: "/cover-images/7.jpg",
				audioUrl: "/songs/7.mp3",
			},
			{
				songName: "Neon Lights",
				artistName: "Night Runners",
				songImageUrl: "/cover-images/5.jpg",
				audioUrl: "/songs/5.mp3",
			},
			{
				songName: "Urban Jungle",
				artistName: "City Lights",
				songImageUrl: "/cover-images/15.jpg",
				audioUrl: "/songs/15.mp3",
			},
			{
				songName: "Neon Dreams",
				artistName: "Cyber Pulse",
				songImageUrl: "/cover-images/13.jpg",
				audioUrl: "/songs/13.mp3",
			},
			{
				songName: "Summer Daze",
				artistName: "Coastal Kids",
				songImageUrl: "/cover-images/4.jpg",
				audioUrl: "/songs/4.mp3",
			},
			{
				songName: "Ocean Waves",
				artistName: "Coastal Drift",
				songImageUrl: "/cover-images/9.jpg",
				audioUrl: "/songs/9.mp3",
			},
			{
				songName: "Crystal Rain",
				artistName: "Echo Valley",
				songImageUrl: "/cover-images/16.jpg",
				audioUrl: "/songs/16.mp3",
			},
			{
				songName: "Starlight",
				artistName: "Luna Bay",
				songImageUrl: "/cover-images/10.jpg",
				audioUrl: "/songs/10.mp3",
			},
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
				songName: "Moonlight Dance",
				artistName: "Silver Shadows",
				songImageUrl: "/cover-images/14.jpg",
				audioUrl: "/songs/14.mp3",
			},
			{
				songName: "Lost in Tokyo",
				artistName: "Electric Dreams",
				songImageUrl: "/cover-images/3.jpg",
				audioUrl: "/songs/3.mp3",
			},
			{
				songName: "Neon Tokyo",
				artistName: "Future Pulse",
				songImageUrl: "/cover-images/17.jpg",
				audioUrl: "/songs/17.mp3",
			},
			{
				songName: "Purple Sunset",
				artistName: "Dream Valley",
				songImageUrl: "/cover-images/12.jpg",
				audioUrl: "/songs/12.mp3",
			},
		]);

		// Create albums with references to song IDs
		const albums = [
			{
				albumName: "Urban Nights",
				artistName: "Various Artists",
				albumImageUrl: "/albums/1.jpg",
				song: createdSongs.slice(0, 4).map((s) => s._id),
			},
			{
				albumName: "Coastal Dreaming",
				artistName: "Various Artists",
				albumImageUrl: "/albums/2.jpg",
				song: createdSongs.slice(4, 8).map((s) => s._id),
			},
			{
				albumName: "Midnight Sessions",
				artistName: "Various Artists",
				albumImageUrl: "/albums/3.jpg",
				song: createdSongs.slice(8, 11).map((s) => s._id),
			},
			{
				albumName: "Eastern Dreams",
				artistName: "Various Artists",
				albumImageUrl: "/albums/4.jpg",
				song: createdSongs.slice(11, 14).map((s) => s._id),
			},
		];

		await Album.insertMany(albums);

		console.log("✅ Database seeded successfully!");
	} catch (error) {
		console.error("❌ Error seeding database:", error.message);
	} finally {
		await mongoose.disconnect();
	}
};

seedDatabase();
