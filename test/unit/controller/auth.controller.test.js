import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as authController from '../../../src/controller/auth.controller.js';
import * as authMiddleware from '../../../src/middleware/auth.middleware.js';
import { User } from '../../../src/model/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

vi.mock('../../../src/model/user.model.js');
vi.mock('bcrypt');
vi.mock('jsonwebtoken');

describe('Auth Middleware and Controller - Login Flow', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      headers: {},
    };
    res = {
      status: vi.fn(() => res),
      json: vi.fn(),
    };
    next = vi.fn();

    process.env.ADMIN_EMAIL = 'admin@example.com';
    process.env.ADMIN_PASSWORD = 'admin123';
    process.env.JWT_SECRET = 'testsecret';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should login as admin with correct credentials', async () => {
    req.body = {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    };

    await authMiddleware.authenticateUser(req, res, next);

    expect(req.user).toEqual({ email: process.env.ADMIN_EMAIL, isAdmin: true });
    expect(req.isAdmin).toBe(true);
    expect(next).toHaveBeenCalled();
  });

  it('should reject login with missing fields', async () => {
    req.body = { email: '' };

    await authMiddleware.authenticateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email and password are required' });
  });

  it('should reject login for non-existent user', async () => {
    req.body = { email: 'user@example.com', password: 'pass123' };
    User.findOne.mockResolvedValue(null);

    await authMiddleware.authenticateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
  });

  it('should reject login for wrong password', async () => {
    req.body = { email: 'user@example.com', password: 'wrongpass' };
    User.findOne.mockResolvedValue({ email: 'user@example.com', password: 'hashedpass' });
    bcrypt.compare.mockResolvedValue(false);

    await authMiddleware.authenticateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
  });

  it('should pass user to controller on successful DB login', async () => {
    req.body = { email: 'user@example.com', password: 'correctpass' };
    const fakeUser = { _id: '123', email: 'user@example.com', fullName: 'Test User', password: 'hashedpass' };
    User.findOne.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValue(true);

    await authMiddleware.authenticateUser(req, res, next);

    expect(req.user).toEqual(fakeUser);
    expect(req.isAdmin).toBe(false);
    expect(next).toHaveBeenCalled();
  });

  it('should return JWT token in login controller', async () => {
    req.user = { _id: '123', email: 'user@example.com', fullName: 'Test User' };
    req.isAdmin = false;
    jwt.sign.mockReturnValue('fake-jwt-token');

    await authController.login(req, res);

    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: '123', email: 'user@example.com', isAdmin: false },
      'testsecret',
      { expiresIn: '1d' }
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Login successful',
      token: 'fake-jwt-token',
      user: {
        id: '123',
        fullName: 'Test User',
        email: 'user@example.com',
        isAdmin: false,
      },
    });
  });
});

describe('Auth Controller - Register', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
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

  it('should return 400 if email already exists', async () => {
    req.body = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };
    User.findOne.mockResolvedValue({ email: 'test@example.com' });

    await authController.register(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email already exists' });
  });

  it('should register a new user successfully', async () => {
    req.body = {
      fullName: 'New User',
      email: 'new@example.com',
      password: 'password123',
    };

    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashed_password');
    User.create.mockResolvedValue({
      _id: '12345',
      email: 'new@example.com',
      fullName: 'New User',
    });

    await authController.register(req, res, next);

    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(User.create).toHaveBeenCalledWith({
      fullName: 'New User',
      email: 'new@example.com',
      password: 'hashed_password',
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User Successfully Registered',
      user: {
        id: '12345',
        email: 'new@example.com',
        fullName: 'New User',
      },
    });
  });

  it('should call next with error if something fails', async () => {
    const error = new Error('DB error');
    req.body = {
      fullName: 'Fail User',
      email: 'fail@example.com',
      password: 'failpass',
    };
    User.findOne.mockRejectedValue(error);

    await authController.register(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
