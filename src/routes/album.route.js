import { Router } from "express";
import {
  getAllAlbum,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum
} from "../controller/album.controller.js";

import { fields } from "../middleware/upload.middleware.js"; // CommonJS multer module

const router = Router();

// GET /albums - Get all albums
router.get('/', getAllAlbum);

// GET /albums/:id - Get album by ID
router.get('/:id', getAlbumById);

// POST /albums - Create a new album (with optional albumImage file)
router.post(
  '/',
  fields([
    { name: 'albumImage', maxCount: 1 }
  ]),
  createAlbum
);

// PUT /albums/:id - Update album
router.put('/:id', updateAlbum);

// DELETE /albums/:id - Delete album
router.delete('/:id', deleteAlbum);

export default router;
