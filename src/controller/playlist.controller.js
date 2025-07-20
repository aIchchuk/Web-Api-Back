import { Playlist } from "../model/playlist.model.js";

// Get all playlists (optionally, you could filter by user)
export const getAllPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find()
      .populate("createdBy", "fullName email")  // only select user fields you want
      .populate("songs");

    return res.status(200).json({
      message: "All playlists fetched successfully",
      data: playlists,
    });
  } catch (error) {
    next(error);
  }
};

// Get playlist by ID
export const getPlaylistById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findById(id)
      .populate("createdBy", "fullName email")
      .populate("songs");

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    return res.status(200).json({
      message: "Playlist fetched successfully",
      data: playlist,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new playlist
export const createPlaylist = async (req, res, next) => {
  try {
    const { playlistName, playlistImageUrl, createdBy } = req.body;
    const playlistImagePath = req.files?.playlistImage?.[0]?.path || null;

    if (!playlistName || !createdBy) {
      return res.status(400).json({ message: "Missing required fields (playlistName, createdBy)" });
    }

    if (!playlistImagePath && !playlistImageUrl) {
      return res.status(400).json({ message: "Provide either playlistImage file or playlistImageUrl" });
    }

    const newPlaylist = new Playlist({
      playlistName,
      playlistImage: playlistImagePath || null,
      playlistImageUrl: playlistImageUrl || null,
      createdBy,
      songs: [], // empty initially
    });

    await newPlaylist.save();

    return res.status(201).json({
      message: "Playlist created successfully",
      data: newPlaylist,
    });
  } catch (error) {
    next(error);
  }
};

// Update playlist (name, image, etc.) - user must own playlist
export const updatePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.body.createdBy; // assuming you get userId from req.body or req.user
    if (!userId) {
      return res.status(400).json({ message: "Missing user identification" });
    }

    // Find playlist owned by user
    const playlist = await Playlist.findOne({ _id: id, createdBy: userId });
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found or unauthorized" });
    }

    // Update fields from request body (avoid overriding createdBy or songs here)
    if (req.body.playlistName !== undefined) playlist.playlistName = req.body.playlistName;
    if (req.body.playlistImageUrl !== undefined) playlist.playlistImageUrl = req.body.playlistImageUrl;
    if (req.files?.playlistImage?.[0]?.path) playlist.playlistImage = req.files.playlistImage[0].path;

    await playlist.save();

    return res.status(200).json({
      message: "Playlist updated successfully",
      data: playlist,
    });
  } catch (error) {
    next(error);
  }
};

// Delete playlist - user must own playlist
export const deletePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.body.createdBy; // or req.user.id from auth middleware
    if (!userId) {
      return res.status(400).json({ message: "Missing user identification" });
    }

    const deletedPlaylist = await Playlist.findOneAndDelete({ _id: id, createdBy: userId });
    if (!deletedPlaylist) {
      return res.status(404).json({ message: "Playlist not found or unauthorized" });
    }

    return res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Add song to playlist (user must own playlist)
export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { playlistId, songId } = req.params;
    const userId = req.body.createdBy; // or req.user.id

    if (!userId) {
      return res.status(400).json({ message: "Missing user identification" });
    }

    const playlist = await Playlist.findOne({ _id: playlistId, createdBy: userId });
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found or unauthorized" });
    }

    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }

    return res.status(200).json({
      message: "Song added to playlist successfully",
      data: playlist,
    });
  } catch (error) {
    next(error);
  }
};

// Remove song from playlist (user must own playlist)
export const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const { playlistId, songId } = req.params;
    const userId = req.body.createdBy; // or req.user.id

    if (!userId) {
      return res.status(400).json({ message: "Missing user identification" });
    }

    const playlist = await Playlist.findOne({ _id: playlistId, createdBy: userId });
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found or unauthorized" });
    }

    playlist.songs = playlist.songs.filter((id) => id.toString() !== songId);
    await playlist.save();

    return res.status(200).json({
      message: "Song removed from playlist successfully",
      data: playlist,
    });
  } catch (error) {
    next(error);
  }
};
