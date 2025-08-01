import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as albumController from '../../../src/controller/album.controller.js';
import { Album } from '../../../src/model/album.model.js';

vi.mock('../../../src/model/album.model.js');

let req, res, next;

beforeEach(() => {
  req = {
    body: {},
    params: {},
    files: {},
    user: { userId: 'user123' },
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

describe('Album Controller', () => {
  it('getAllAlbum - should return all albums', async () => {
    Album.find.mockReturnValue({ populate: vi.fn().mockResolvedValue(['album1', 'album2']) });
    await albumController.getAllAlbum(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Get All Albums', data: ['album1', 'album2'] });
  });


  it('createAlbum - should return 400 if missing fields', async () => {
    req.body = { albumName: '', artistName: '' };
    await albumController.createAlbum(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('createAlbum - should create album with file', async () => {
    req.body = {
      albumName: 'Album X',
      artistName: 'Artist Y',
    };
    req.files = {
      albumImage: [{ filename: 'image123.jpg' }]
    };
    Album.mockImplementation(() => ({
      save: vi.fn().mockResolvedValue(),
      albumName: 'Album X',
      artistName: 'Artist Y',
    }));
    await albumController.createAlbum(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('updateAlbum - should return 404 if album not found', async () => {
    req.params.id = 'fake';
    Album.findByIdAndUpdate.mockResolvedValue(null);
    await albumController.updateAlbum(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('deleteAlbum - should delete an album successfully', async () => {
    req.params.id = '123';
    Album.findByIdAndDelete.mockResolvedValue({ _id: '123' });
    await albumController.deleteAlbum(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Successfully deleted Album' });
  });

  it('addSongToAlbum - should add a song to the album', async () => {
    req.params.albumId = 'album123';
    req.params.songId = 'song123';
    const album = { song: [], save: vi.fn(), _id: 'album123' };
    Album.findById.mockResolvedValue(album);

    await albumController.addSongToAlbum(req, res, next);
    expect(album.song).toContain('song123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Song added to album successfully',
      data: album,
    });
  });

  it('removeSongFromAlbum - should remove a song from the album', async () => {
    req.params.albumId = 'album123';
    req.params.songId = 'song123';
    const album = { song: ['song123', 'song456'], save: vi.fn() };
    Album.findById.mockResolvedValue(album);

    await albumController.removeSongFromAlbum(req, res, next);
    expect(album.song).not.toContain('song123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Song removed from album successfully',
      data: album,
    });
  });
});
