import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as songController from '../../../src/controller/song.controller.js';
import { Song } from '../../../src/model/song.model.js';

vi.mock('../../../src/model/song.model.js');

describe('Song Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      files: {},
    };
    res = {
      status: vi.fn(() => res),
      json: vi.fn(),
    };
    next = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createSong', () => {
    it('should return 400 if required fields are missing', async () => {
      req.body = { songName: '', artistName: '' };

      await songController.createSong(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
    });

    it('should create a song with files', async () => {
      req.body = {
        songName: 'Test Song',
        artistName: 'Test Artist',
        albumName: 'Test Album',
      };
      req.files = {
        songImage: [{ filename: 'image.jpg', originalname: 'img.jpg' }],
        audioFile: [{ filename: 'audio.mp3', originalname: 'aud.mp3' }],
      };

      Song.prototype.save = vi.fn().mockResolvedValue({ _id: '1' });

      await songController.createSong(req, res, next);

      expect(Song.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        message: 'Song created successfully',
        data: expect.any(Object),
      }));
    });
  });

  describe('updateSong', () => {
    it('should return 404 if song not found', async () => {
      req.params.id = 'nonexistent';
      Song.findByIdAndUpdate.mockResolvedValue(null);

      await songController.updateSong(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Song not found' });
    });

    it('should update a song successfully', async () => {
      req.params.id = '123';
      req.body = { songName: 'Updated Song' };
      const updatedSong = { _id: '123', songName: 'Updated Song' };
      Song.findByIdAndUpdate.mockResolvedValue(updatedSong);

      await songController.updateSong(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Song updated Successfully',
        data: updatedSong,
      });
    });
  });

  describe('deleteSong', () => {
    it('should return 404 if song not found', async () => {
      req.params.id = 'nonexistent';
      Song.findByIdAndDelete.mockResolvedValue(null);

      await songController.deleteSong(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Song not found' });
    });

    it('should delete a song successfully', async () => {
      req.params.id = '123';
      Song.findByIdAndDelete.mockResolvedValue({ _id: '123' });

      await songController.deleteSong(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Song deleted Successfully' });
    });
  });
});
