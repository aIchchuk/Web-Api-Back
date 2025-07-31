import { Song } from "../model/song.model.js";
import { Album } from "../model/album.model.js";
import { User } from "../model/user.model.js";

// Admin-only stats
export const getStat = async (req, res, next) => {
  try {
    const [totalSong, totalAlbum, totalUser] = await Promise.all([
      Song.countDocuments(),
      Album.countDocuments(),
      User.countDocuments(),
    ]);

    const [songArtists, albumArtists] = await Promise.all([
      Song.distinct("artistName"),
      Album.distinct("artistName"),
    ]);

    const artistSet = new Set([...songArtists, ...albumArtists]);
    const totalArtist = artistSet.size;

    res.status(200).json({
      totalUser,
      totalArtist,
      totalSong,
      totalAlbum,
    });
  } catch (error) {
    console.error("🔥 /stat error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
