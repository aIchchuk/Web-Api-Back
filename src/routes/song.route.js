import { Router } from "express";
import {
    getAllSong,
    getSongById,
    createSong,
    updateSong,
    deleteSong
} from "../controller/song.controller.js";

import { fields } from "../middleware/upload.middleware.js";

const router = Router();

router.get('/getAllSong', getAllSong);

router.get('/getSongById/:id', getSongById);

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

export default router;
