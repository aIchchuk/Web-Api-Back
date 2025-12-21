/// <reference types="vitest" />
import request from 'supertest';
import app from '../../../src/index.js';  // adjust path as needed

import { Song } from '../../../src/model/song.model.js';
import { Album } from '../../../src/model/album.model.js';
import { User } from '../../../src/model/user.model.js';

import { vi } from 'vitest';

// Mock Mongoose models
vi.mock('../../../src/model/song.model.js');
vi.mock('../../../src/model/album.model.js');
vi.mock('../../../src/model/user.model.js');

describe('Stat Controller', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /stat', () => {
    it('should return counts and total artists for admin user', async () => {
      // Mock countDocuments for all models
      Song.countDocuments = vi.fn().mockResolvedValue(10);
      Album.countDocuments = vi.fn().mockResolvedValue(5);
      User.countDocuments = vi.fn().mockResolvedValue(20);

      // Mock distinct artist names
      Song.distinct = vi.fn().mockResolvedValue(['Artist1', 'Artist2']);
      Album.distinct = vi.fn().mockResolvedValue(['Artist2', 'Artist3']);

      // Generate a valid JWT token with isAdmin=true (you can sign with same secret)
      const jwt = await import('jsonwebtoken');
      const token = jwt.sign({ isAdmin: true, email: 'admin@example.com' }, process.env.JWT_SECRET);

      const response = await request(app)
        .get('/stat')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        totalUser: 20,
        totalSong: 10,
        totalAlbum: 5,
        totalArtist: 3,  // Artist1, Artist2, Artist3 merged uniquely
      });

      // Ensure mocks were called
      expect(Song.countDocuments).toHaveBeenCalled();
      expect(Album.countDocuments).toHaveBeenCalled();
      expect(User.countDocuments).toHaveBeenCalled();
      expect(Song.distinct).toHaveBeenCalledWith('artistName');
      expect(Album.distinct).toHaveBeenCalledWith('artistName');
    });

    it('should return 401 if no token provided', async () => {
      const response = await request(app).get('/stat');
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('No token provided');
    });

    it('should return 403 if user is not admin', async () => {
      // Token with isAdmin false
      const jwt = await import('jsonwebtoken');
      const token = jwt.sign({ isAdmin: false, email: 'user@example.com' }, process.env.JWT_SECRET);

      const response = await request(app)
        .get('/stat')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe('Access denied. Admins only.');
    });

    it('should return 500 on internal error', async () => {
      // Make countDocuments throw an error
      Song.countDocuments = vi.fn().mockRejectedValue(new Error('DB error'));
      Album.countDocuments = vi.fn().mockResolvedValue(0);
      User.countDocuments = vi.fn().mockResolvedValue(0);
      Song.distinct = vi.fn();
      Album.distinct = vi.fn();

      const jwt = await import('jsonwebtoken');
      const token = jwt.sign({ isAdmin: true, email: 'admin@example.com' }, process.env.JWT_SECRET);

      const response = await request(app)
        .get('/stat')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBe('Internal Server Error');
      expect(response.body.error).toBe('DB error');
    });
  });
});
