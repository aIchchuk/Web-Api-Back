import { Router } from "express";
import {
  getAllPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist
} from "../controller/playlist.controller.js";

import { fields } from "../middleware/upload.middleware.js";  // your multer setup

const router = Router();

// GET /playlists - Get all playlists
router.get('/', getAllPlaylists);

// GET /playlists/:id - Get playlist by ID
router.get('/:id', getPlaylistById);

// POST /playlists - Create playlist (accept file upload)
router.post(
  '/',
  fields([{ name: 'playlistImage', maxCount: 1 }]),
  createPlaylist
);

// PUT /playlists/:id - Update playlist
router.put('/:id', updatePlaylist);

// DELETE /playlists/:id - Delete playlist
router.delete('/:id', deletePlaylist);

export default router;
