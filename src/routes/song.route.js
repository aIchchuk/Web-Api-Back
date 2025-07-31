import { Router } from "express";
import {
    getAllSong,
    getSongById,
    createSong,
    updateSong,
    deleteSong,
    getFeaturedSong,
    getMadeForYouSong,
    getTrendingSong,
    getSongByName,
    convertReelToSong
} from "../controller/song.controller.js";

import { verifyToken, isOwnerOrAdmin } from "../middleware/auth.middleware.js";

import { fields } from "../middleware/upload.middleware.js";
import { Song } from "../model/song.model.js";

const router = Router();

router.get('/getAllSong', getAllSong);

router.get('/getSongById/:id', getSongById);

router.get('/getSongByName/:songName', getSongByName);


// Use multer to allow both image and audio file uploads
router.post(
    '/createSong',
    fields([
        { name: "songImage", maxCount: 1 },
        { name: "audioFile", maxCount: 1 }
    ]), 
    verifyToken,
    createSong
);

router.put('/updateSong/:id', updateSong);
router.delete('/deleteSong/:id', isOwnerOrAdmin(Song), deleteSong);

router.get('/featuredSong', getFeaturedSong);
router.get('/madeForYouSong', getMadeForYouSong);
router.get('/trendingSong', getTrendingSong);
router.post("/convert-reel", convertReelToSong);

export default router;
