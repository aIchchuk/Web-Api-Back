import { Playlist } from "../model/playlist.model.js";

export const canViewPlaylist = async (req, res, next) => {
  try {
    const playlistId = req.params.id || req.params.playlistId;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (playlist.public) {
      return next(); // Public playlists are accessible to all
    }

    // If playlist is private, only admin or creator can access
    const user = req.user;
    const isAdmin = req.isAdmin;

    if (!user && !isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (isAdmin || playlist.createdBy.toString() === user?._id?.toString()) {
      return next();
    }

    return res.status(403).json({ message: "Forbidden: You don’t have access to this private playlist" });
  } catch (error) {
    next(error);
  }
};
