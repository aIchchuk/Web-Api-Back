import { Playlist } from "../model/playlist.model.js";

export const getAllPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find().populate("createdBy");
    return res.status(200).json({
      message: "All playlists fetched successfully",
      data: playlists,
    });
  } catch (error) {
    next(error);
  }
};

export const getPlaylistById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findById(id).populate("createdBy");

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

export const createPlaylist = async (req, res, next) => {
  try {
    const { playlistName, playlistImageUrl, createdBy } = req.body;
    const playlistImagePath = req.files.playlistImage?.[0]?.path || null;

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

export const updatePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedPlaylist = await Playlist.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedPlaylist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    return res.status(200).json({
      message: "Playlist updated successfully",
      data: updatedPlaylist,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedPlaylist = await Playlist.findByIdAndDelete(id);

    if (!deletedPlaylist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    return res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    next(error);
  }
};
