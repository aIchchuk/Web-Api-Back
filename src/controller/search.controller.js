import { Song } from "../model/song.model.js";
import { Album } from '../model/album.model.js';

export const getSuggestions = async (req, res) => {
  try {
    const query = req.query.q?.trim() || '';

    if (!query) {
      return res.json([]);
    }

    // Find matching songs (limit results)
    const songs = await Song.find({
      songName: { $regex: query, $options: 'i' },
    }).select('songName artistName audioUrl').limit(9);

    // Map songs for frontend
    const songResults = songs.map(song => ({
      id: song._id,
      type: 'song',
      name: song.songName,
      artistName: song.artistName,
      audioUrl: song.audioUrl,
    }));

    // Find matching albums
    const albums = await Album.find({
      albumName: { $regex: query, $options: 'i' },
    })
      .populate({
        path: 'song',
        select: 'songName audioUrl',
        options: { limit: 10 } // Limit songs per album
      })
      .limit(5);

    // Map albums for frontend including songs
    const albumResults = albums.map(album => ({
    id: album._id,
    type: 'album',
    name: album.albumName,
    artistName: album.artistName,
    songs: Array.isArray(album.song)
        ? album.song.map(song => ({
            id: song._id,
            name: song.songName,
            audioUrl: song.audioUrl,
        }))
        : [],
    }));


    // Combine results and send
    const results = [...songResults, ...albumResults];
    res.json(results);
  } catch (error) {
    console.error('Search suggestion error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
