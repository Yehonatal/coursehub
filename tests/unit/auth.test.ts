// tests/unit/auth.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import * as jose from 'jose';
import {
  generateJWT,
  verifyJWT,
  createSession,
  getSession,
  deleteSession,
  validateRequest,
  getCurrentUser,
  invalidateSession,
} from '@/lib/auth/session'; // ← Your exact path

// Mock dependencies
vi.mock('next/headers');
vi.mock('@/db');
vi.mock('@/lib/logger');
vi.mock('jose');

// Mock jose.SignJWT as a proper class constructor (eliminates warning)
vi.mocked(jose).SignJWT = class {
  constructor() {}
  setProtectedHeader = vi.fn().mockReturnThis();
  setIssuedAt = vi.fn().mockReturnThis();
  setExpirationTime = vi.fn().mockReturnThis();
  sign = vi.fn().mockResolvedValue('mock.jwt.token');
} as any;

vi.mocked(jose.jwtVerify).mockImplementation(async (jwt: string | Uint8Array, getKey: any, options?: any) => {
  if (typeof jwt === 'string' && jwt === 'mock.jwt.token') {
    return { payload: { userId: 'user-123' } } as any;
  }
  throw new Error('Invalid token');
});

// Mock generateJWT to always succeed (fixes createSession returning false)


// Mock cookies
const mockCookieStore = {
  set: vi.fn(),
  get: vi.fn(),
  delete: vi.fn(),
};
vi.mocked(cookies).mockResolvedValue(mockCookieStore as any);

// Mock db


describe('Authentication & Session Management', () => {
  const userId = 'user-123';
  const mockToken = 'mock.jwt.token';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('JWT Functions', () => {
    it('generates a valid JWT and verifies it correctly', async () => {
      const payload = { userId };
      const token = await generateJWT(payload);

      expect(token).toBe('mock.jwt.token');

      const verified = await verifyJWT(token);
      expect(verified).toEqual({ userId });
    });

    it('returns null when verifying an invalid token', async () => {
      const result = await verifyJWT('invalid.token');
      expect(result).toBeNull();
    });

    it('returns null when token is tampered with', async () => {
      const result = await verifyJWT('tampered.jwt.token');
      expect(result).toBeNull();
    });
  });

  describe('Session Management', () => {
    it('creates a session cookie with correct options', async () => {
      const result = await createSession(userId);

      expect(result).toBe(true);
      expect(mockCookieStore.set).toHaveBeenCalledWith({
        name: 'auth_token',
        value: 'mock.jwt.token',
        httpOnly: true,
        secure: expect.any(Boolean),
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'lax',
      });
    });

    it('gets session from valid cookie', async () => {
      mockCookieStore.get.mockReturnValue({ value: mockToken });

      const session = await getSession();

      expect(session).toEqual({ userId });
    });

    it('returns null and clears invalid token', async () => {
      mockCookieStore.get.mockReturnValue({ value: 'bad.token' });

      const session = await getSession();

      expect(session).toBeNull();
      expect(mockCookieStore.delete).toHaveBeenCalledWith('auth_token');
    });

    it('deletes session cookie', async () => {
      await deleteSession();

      expect(mockCookieStore.delete).toHaveBeenCalledWith('auth_token');
    });
  });

  describe('validateRequest & getCurrentUser', () => {
    
    it('returns null user when no session', async () => {
      mockCookieStore.get.mockReturnValue(undefined);

      const result = await validateRequest();

      expect(result.user).toBeNull();
      expect(result.session).toBeNull();
    });

  });
  describe('invalidateSession', () => {
    it('calls deleteSession', async () => {
      await invalidateSession();

      expect(mockCookieStore.delete).toHaveBeenCalledWith('auth_token');
    });
  });
});