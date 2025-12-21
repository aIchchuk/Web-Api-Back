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
    convertReelToSong,
    uploadAudio,
    uploadImage
} from "../controller/song.controller.js";

import { fields } from "../middleware/upload.middleware.js";
import { single } from "../middleware/uploads.js";

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
router.post("/convert-reel", convertReelToSong);



router.post("/upload-image", single("songImage"), uploadImage);
router.post("/upload-audio", single("audioFile"), uploadAudio);


export default router;
