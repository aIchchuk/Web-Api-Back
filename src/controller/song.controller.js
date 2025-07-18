import { Song } from "../model/song.model.js";

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

export const createSong = async (req, res, next) => {
    try {
        const { songName, artistName, albumName, songImageUrl, audioUrl } = req.body;

        // Uploaded file paths
        const songImagePath = req.files.songImage?.[0]?.path || null;
        const audioFilePath = req.files.audioFile?.[0]?.path || null;

        if (!songName || !artistName) {
            return res.status(400).json({ message: "Missing required fields (songName, artistName)" });
        }

        if (!songImagePath && !songImageUrl) {
            return res.status(400).json({ message: "Provide either songImage file or songImageUrl" });
        }

        if (!audioFilePath && !audioUrl) {
            return res.status(400).json({ message: "Provide either audioFile or audioUrl" });
        }

        const newSong = new Song({
            songName,
            artistName,
            albumName: albumName || null,
            songImage: songImagePath,
            songImageUrl: songImageUrl || null,
            audioFile: audioFilePath,
            audioUrl: audioUrl || null
        });

        await newSong.save();

        return res.status(201).json({
            success: true,
            message: "Song created successfully",
            data: newSong
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