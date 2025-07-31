import { Router } from "express";
import {
  getAllAlbum,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addSongToAlbum,
  removeSongFromAlbum
} from "../controller/album.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

import { fields } from "../middleware/upload.middleware.js";

const router = Router();

router.get('/getAllAlbum', getAllAlbum);
router.get('/getAlbumById/:id', getAlbumById);

router.post(
  '/createAlbum',
  fields([
    { name: 'albumImage', maxCount: 1 }
  ]),
  verifyToken, 
  createAlbum
);

router.put('/updateAlbum/:id', updateAlbum);
router.delete('/deleteAlbum/:id', deleteAlbum);

// Add song to album
router.post('/:albumId/songs/:songId', addSongToAlbum);

// Remove song from album
router.delete('/:albumId/songs/:songId', removeSongFromAlbum);

export default router;
