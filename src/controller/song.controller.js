import { Song } from "../model/song.model.js";
import path from "path";
import { convertReelToMp3 } from "../utils/reelsToMp3.js";


const backendBaseUrl = "http://localhost:5000"; // Ideally use env variable

export const getAllSong = async (req, res, next) => {
  try {
    const song = await Song.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Fetched all songs",
      data: song,
    });
  } catch (error) {
    next(error);
  }
};

export const getSongById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const songById = await Song.findById(id);
    if (!songById) {
      return res.status(404).json({ message: "Song not found" });
    }
    return res.status(200).json({ message: "Song Id: Get", data: songById });
  } catch (error) {
    next(error);
  }
};

export const getSongByName = async (req, res, next) => {
  try {
    const { songName } = req.params;
    const songByName = await Song.find({ songName });
    return res.status(200).json({ message: "Song Name: Get", data: songByName });
  } catch (error) {
    next(error);
  }
};

export const createSong = async (req, res, next) => {
  try {
    const { songName, artistName, albumName, songImageUrl, audioUrl } = req.body;

    const songImageFile = req.files?.songImage?.[0];
    const audioFile = req.files?.audioFile?.[0];

    if (!songName || !artistName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!songImageFile && !songImageUrl) {
      return res.status(400).json({ message: "Provide songImage file or songImageUrl" });
    }

    if (!audioFile && !audioUrl) {
      return res.status(400).json({ message: "Provide audioFile or audioUrl" });
    }

    const songImage = songImageFile
      ? `${backendBaseUrl}/cover-images/${songImageFile.filename}`
      : songImageUrl;

    const audioFilePath = audioFile
      ? `${backendBaseUrl}/songs/${audioFile.filename}`
      : audioUrl;

    const newSong = new Song({
      songName,
      artistName,
      albumName: albumName || null,
      songImageUrl: songImage,
      audioUrl: audioFilePath,
      originalImageFileName: songImageFile?.originalname || null,
      originalAudioFileName: audioFile?.originalname || null,
    });

    await newSong.save();

    return res.status(201).json({
      success: true,
      message: "Song created successfully",
      data: newSong,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedSong = await Song.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedSong) {
      return res.status(404).json({ message: "Song not found" });
    }
    return res.status(200).json({ message: "Song updated Successfully", data: updatedSong });
  } catch (error) {
    next(error);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedSong = await Song.findByIdAndDelete(id);
    if (!deletedSong) {
      return res.status(404).json({ message: "Song not found" });
    }
    return res.status(200).json({ message: "Song deleted Successfully" });
  } catch (error) {
    next(error);
  }
};

// Get 6 random featured songs
export const getFeaturedSong = async (req, res, next) => {
  try {
    const song = await Song.aggregate([
      { $sample: { size: 6 } },
      {
        $project: {
          _id: 1,
          songName: 1,
          artistName: 1,
          songImageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    return res.status(200).json({
      success: true,
      message: "Fetched featured songs",
      data: song,
    });
  } catch (error) {
    next(error);
  }
};

// Get 4 random made-for-you songs
export const getMadeForYouSong = async (req, res, next) => {
  try {
    const song = await Song.aggregate([
      { $sample: { size: 4 } },
      {
        $project: {
          _id: 1,
          songName: 1,
          artistName: 1,
          songImageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    return res.status(200).json({
      success: true,
      message: "Fetched made-for-you songs",
      data: song,
    });
  } catch (error) {
    next(error);
  }
};

// Get 4 random trending songs
export const getTrendingSong = async (req, res, next) => {
  try {
    const song = await Song.aggregate([
      { $sample: { size: 4 } },
      {
        $project: {
          _id: 1,
          songName: 1,
          artistName: 1,
          songImageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    return res.status(200).json({
      success: true,
      message: "Fetched trending songs",
      data: song,
    });
  } catch (error) {
    next(error);
  }
};

// Convert Instagram Reel to MP3 and save song
export const convertReelToSong = async (req, res) => {
  try {
    const { reelUrl, songName, artistName, albumName } = req.body;

    if (!reelUrl || !songName || !artistName) {
      return res.status(400).json({ message: "reelUrl, songName, and artistName are required" });
    }

    // Call utility to convert reel to MP3 and save file
    const { filename, filepath, sourceUrl } = await convertReelToMp3(reelUrl);

    // Create new song document in DB
    const newSong = await Song.create({
      songName,
      artistName,
      albumName: albumName || null,
      audioUrl: filepath,
      sourceUrl, // optional: store reel URL source
    });

    return res.status(201).json({
      success: true,
      message: "Reel converted and saved successfully",
      data: newSong,
    });
  } catch (error) {
    console.error("Error converting reel:", error);
    return res.status(500).json({ message: "Failed to convert reel", error: error.message });
  }
};

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file uploaded" });
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        filename: req.file.filename,
        path: `/cover-images/${req.file.filename}`,
      },
    });
  } catch (error) {
    next(error);
  }
}

export const uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No audio file uploaded" });
    }

    res.status(200).json({
      success: true,
      message: "Audio uploaded successfully",
      data: {
        filename: req.file.filename,
        path: `/songs/${req.file.filename}`,
      },
    });
  } catch (error) {
    next(error)
  }
}
