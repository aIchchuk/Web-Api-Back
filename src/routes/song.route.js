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
    getSongByName
} from "../controller/song.controller.js";

import { fields } from "../middleware/upload.middleware.js";

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
    createSong
);

router.put('/updateSong/:id', updateSong);
router.delete('/deleteSong/:id', deleteSong);

router.get('/featuredSong', getFeaturedSong);
router.get('/madeForYouSong', getMadeForYouSong);
router.get('/trendingSong', getTrendingSong);

export default router;
