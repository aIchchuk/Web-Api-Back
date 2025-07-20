import { Album } from "../model/album.model.js";

export const getAllAlbum = async (req, res, next) => {
  try {
    const album = await Album.find().populate("song");
    return res.status(200).json({ message: 'Get All Albums', data: album });
  } catch (error) {
    next(error);
  }
};

export const getAlbumById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const albumById = await Album.findById(id).populate("song");

    if (!albumById) {
      return res.status(404).json({ message: 'No such album found' });
    }

    return res.status(200).json({ message: 'Album Found', data: albumById });
  } catch (error) {
    next(error);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    const { albumName, artistName, albumImageUrl, song } = req.body;
    const albumImagePath = req.files?.albumImage?.[0]?.path || null;

    if (!albumName || !artistName) {
      return res.status(400).json({ message: 'One or more required fields are missing' });
    }

    if (!albumImagePath && !albumImageUrl) {
      return res.status(400).json({ message: 'Provide either albumImage file or albumImageUrl' });
    }

    const newAlbum = new Album({
      albumName,
      artistName,
      albumImage: albumImagePath || null,
      albumImageUrl: albumImageUrl || null,
      song: song || [],
    });

    await newAlbum.save();

    return res.status(201).json({ message: "Album created successfully", data: newAlbum });
  } catch (error) {
    next(error);
  }
};

export const updateAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedAlbum = await Album.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedAlbum) {
      return res.status(404).json({ message: 'No such album found to update' });
    }

    return res.status(200).json({ message: 'Successfully updated Album', data: updatedAlbum });
  } catch (error) {
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedAlbum = await Album.findByIdAndDelete(id);

    if (!deletedAlbum) {
      return res.status(404).json({ message: 'No such album found to delete' });
    }

    return res.status(200).json({ message: 'Successfully deleted Album' });
  } catch (error) {
    next(error);
  }
};

// Add song to album
export const addSongToAlbum = async (req, res, next) => {
  try {
    const { albumId, songId } = req.params;

    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    if (!album.song.includes(songId)) {
      album.song.push(songId);
      await album.save();
    }

    return res.status(200).json({
      message: "Song added to album successfully",
      data: album,
    });
  } catch (error) {
    next(error);
  }
};

// Remove song from album
export const removeSongFromAlbum = async (req, res, next) => {
  try {
    const { albumId, songId } = req.params;

    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    album.song = album.song.filter(id => id.toString() !== songId);
    await album.save();

    return res.status(200).json({
      message: "Song removed from album successfully",
      data: album,
    });
  } catch (error) {
    next(error);
  }
};
