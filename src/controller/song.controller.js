import { Song } from "../model/song.model.js";

export const getAllSong = async (req, res, next) => {
    try {
        const song = await Song.find();
        
        return res.status(200).json({ message: 'Get All Songs' });

    } catch (error) {
        next(error);
    }
}

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