import { Router } from "express";
import {
  getAllPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist
} from "../controller/playlist.controller.js";

import { authenticateUser, checkAdmin } from "../middleware/auth.middleware.js";
import { canViewPlaylist } from "../middleware/playlist.middleware.js"; 

import { fields } from "../middleware/upload.middleware.js";  // your multer setup

const router = Router();

// GET /playlists - Get all playlists
router.get('/', getAllPlaylists);

// GET /playlists/:id - Get playlist by ID
router.get('/:id', authenticateUser, checkAdmin, canViewPlaylist, getPlaylistById);

// POST /playlists - Create playlist (accept file upload)
router.post(
  '/',
  fields([{ name: 'playlistImage', maxCount: 1 }]),
  createPlaylist
);

// PUT /playlists/:id - Update playlist (accept file upload if image updated)
router.put(
  '/:id',
  fields([{ name: 'playlistImage', maxCount: 1 }]),
  updatePlaylist
);

// DELETE /playlists/:id - Delete playlist
router.delete('/:id', deletePlaylist);

// POST /playlists/:playlistId/songs/:songId - Add song to playlist
router.post('/:playlistId/songs/:songId', addSongToPlaylist);

// DELETE /playlists/:playlistId/songs/:songId - Remove song from playlist
router.delete('/:playlistId/songs/:songId', removeSongFromPlaylist);

export default router;
