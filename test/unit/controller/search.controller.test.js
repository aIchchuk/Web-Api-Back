/// <reference types="vitest" />
import request from 'supertest';
import app from '../../../src/index.js';

import { Song } from '../../../src/model/song.model.js';
import { Album } from '../../../src/model/album.model.js';

import { vi } from 'vitest';

vi.mock('../../../src/model/song.model.js');
vi.mock('../../../src/model/album.model.js');

describe('Search Controller - getSuggestions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty array if no query provided', async () => {
    const response = await request(app).get('/search/suggestions');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('returns combined song and album results for a query', async () => {
    const mockSongs = [
      {
        _id: 'song1',
        songName: 'Test Song',
        artistName: 'Artist A',
        audioUrl: 'audio1.mp3',
      },
    ];

    const mockAlbums = [
      {
        _id: 'album1',
        albumName: 'Test Album',
        artistName: 'Artist B',
        song: [
          { _id: 'song2', songName: 'Album Song 1', audioUrl: 'audio2.mp3' },
          { _id: 'song3', songName: 'Album Song 2', audioUrl: 'audio3.mp3' },
        ],
      },
    ];

    // Mock Song.find().select().limit() chain
    const songFindMock = {
      select: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue(mockSongs),
    };
    Song.find = vi.fn().mockReturnValue(songFindMock);

    // Mock Album.find().populate().limit() chain
    const populateMock = vi.fn().mockReturnThis();
    const albumFindMock = {
      populate: populateMock,
      limit: vi.fn().mockResolvedValue(mockAlbums),
    };
    Album.find = vi.fn().mockReturnValue(albumFindMock);

    const response = await request(app)
      .get('/search/suggestions')
      .query({ q: 'test' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        id: 'song1',
        type: 'song',
        name: 'Test Song',
        artistName: 'Artist A',
        audioUrl: 'audio1.mp3',
      },
      {
        id: 'album1',
        type: 'album',
        name: 'Test Album',
        artistName: 'Artist B',
        songs: [
          { id: 'song2', name: 'Album Song 1', audioUrl: 'audio2.mp3' },
          { id: 'song3', name: 'Album Song 2', audioUrl: 'audio3.mp3' },
        ],
      },
    ]);

    expect(Song.find).toHaveBeenCalledWith({
      songName: { $regex: 'test', $options: 'i' },
    });
    expect(songFindMock.select).toHaveBeenCalledWith('songName artistName audioUrl');
    expect(songFindMock.limit).toHaveBeenCalledWith(9);

    expect(Album.find).toHaveBeenCalledWith({
      albumName: { $regex: 'test', $options: 'i' },
    });
    expect(populateMock).toHaveBeenCalledWith({
      path: 'song',
      select: 'songName audioUrl',
      options: { limit: 10 },
    });
    expect(albumFindMock.limit).toHaveBeenCalledWith(5);
  });

  it('returns 500 if error occurs', async () => {
    Song.find = vi.fn().mockImplementation(() => {
      throw new Error('DB failure');
    });

    const response = await request(app)
      .get('/search/suggestions')
      .query({ q: 'fail' });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Server error' });
  });
});
