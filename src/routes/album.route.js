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

import { verifyToken, isOwnerOrAdmin } from "../middleware/auth.middleware.js";
import { fields } from "../middleware/upload.middleware.js"; // your multer fields setup
import { Album } from "../model/album.model.js";

const router = Router();

router.get('/getAllAlbum', getAllAlbum);
router.get('/getAlbumById/:id', getAlbumById);

router.post(
  '/createAlbum',
  verifyToken,
  fields([{ name: 'albumImage', maxCount: 1 }]),
  createAlbum
);

router.put('/updateAlbum/:id', verifyToken, isOwnerOrAdmin(Album), updateAlbum);
router.delete('/deleteAlbum/:id', verifyToken, isOwnerOrAdmin(Album), deleteAlbum);

router.post('/:albumId/songs/:songId', verifyToken, isOwnerOrAdmin(Album), addSongToAlbum);
router.delete('/:albumId/songs/:songId', verifyToken, isOwnerOrAdmin(Album), removeSongFromAlbum);

export default router;
