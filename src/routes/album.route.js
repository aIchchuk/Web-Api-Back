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

import { fields } from "../middleware/upload.middleware.js";

const router = Router();

router.get('/', getAllAlbum);
router.get('/:id', getAlbumById);

router.post(
  '/',
  fields([{ name: 'albumImage', maxCount: 1 }]),
  createAlbum
);

router.put('/:id', updateAlbum);
router.delete('/:id', deleteAlbum);

// Add song to album
router.post('/:albumId/songs/:songId', addSongToAlbum);

// Remove song from album
router.delete('/:albumId/songs/:songId', removeSongFromAlbum);

export default router;
