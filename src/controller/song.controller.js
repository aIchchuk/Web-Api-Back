import { nextTick } from "process";
import { Song } from "../model/song.model.js";
const backendBaseUrl = "http://localhost:5000"; // or use env

export const getAllSong = async (req, res, next) => {
	try {
		const song = await Song.find().sort({ createdAt: -1 });
		return res.status(200).json({
			success: true,
			message: 'Fetched all songs',
			data: song,
		});
	} catch (error) {
		next(error);
	}
};

export const getSongById = async (req, res, next) => {
    try {
        const {id} = req.params;

        const songById = await Song.findById(req.params.id);

        return res.status(200).json({ message: 'Song Id: Get' , data: songById });
    } catch (error) {
        next(error);
    }
}

export const getSongByName = async (req, res, next) => {
  try {
    const { songName } = req.params;
    const songByName = await Song.find({ songName });  // Looks good if your schema uses 'songName' field
    return res.status(200).json({ message: 'Song Name: Get', data: songByName });
  } catch (error) {
    next(error);
  }
};


export const createSong = async (req, res, next) => {
  try {
    const { songName, artistName, albumName, songImageUrl, audioUrl } = req.body;

    const songImageFile = req.files.songImage?.[0];
    const audioFile = req.files.audioFile?.[0];

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
	? `${backendBaseUrl}/cover-images/${songImageFile.filename}` // ✅ add filename
	: songImageUrl;

	const audioFilePath = audioFile
	? `${backendBaseUrl}/songs/${audioFile.filename}` // ✅ add filename
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
        
        const {id} = req.params;

        const updatedSong = await Song.findByIdAndUpdate(id, req.body, { new: true });

        if(!updatedSong) {
            return res.status(404).json({ message: 'Song not found'});
        }

        return res.status(200).json({ message: 'Song updated Successfully' });

    } catch (error) {
       next(error); 
    }
}
export const deleteSong = async (req, res, next) => {
    try {
        const {id} = req.params;

        const deletedSong = await Song.findByIdAndDelete(id);

        if(!deletedSong) {
            return res.status(404).json({ message: 'Song not found'});
        }
 
        return res.status(200).json({ message: 'Song deleted Successfully' });
        
    } catch (error) {
        next(error);
    }
}

// Get 6 random featured song
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
			message: 'Fetched featured songs',
			data: song,
		});
	} catch (error) {
		next(error);
	}
};

// Get 4 random made-for-you song
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
			message: 'Fetched made-for-you songs',
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
			message: 'Fetched trending songs',
			data: song,
		});
	} catch (error) {
		next(error);
	}
};