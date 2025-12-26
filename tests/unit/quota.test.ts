// tests/unit/quota.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { db } from '@/db';
import { users, user_quotas } from '@/db/schema';
import { eq } from 'drizzle-orm';
import {
  checkQuota,
  incrementQuota,
  FREE_GENERATIONS_LIMIT,
  FREE_CHATS_LIMIT,
} from "../../lib/ai/quota"; // Your correct path

// Mock db
vi.mock('@/db', () => ({
  db: {
    query: {
      users: { findFirst: vi.fn() },
      user_quotas: { findFirst: vi.fn() },
    },
    insert: vi.fn(),
    update: vi.fn(),
  },
}));

const mockedDb = db as any;

describe('Quota System', () => {
  const userId = 'user-123';
  const now = new Date('2025-12-26T10:00:00Z');

  beforeEach(() => {
    vi.clearAllMocks();
    vi.setSystemTime(now);
  });

  describe('checkQuota', () => {
    it('allows free user within generation limit', async () => {
      mockedDb.query.users.findFirst.mockResolvedValue({
        user_id: userId,
        subscription_status: 'free',
      });

      mockedDb.query.user_quotas.findFirst.mockResolvedValue({
        ai_generations_count: 3,
        last_reset_date: now,
      });

      await expect(checkQuota(userId, 'generation')).resolves.toBe(true);
    });

    it('blocks free user when generation limit exceeded', async () => {
      mockedDb.query.users.findFirst.mockResolvedValue({
        user_id: userId,
        subscription_status: 'free',
      });

      mockedDb.query.user_quotas.findFirst.mockResolvedValue({
        ai_generations_count: FREE_GENERATIONS_LIMIT,
        last_reset_date: now,
      });

      await expect(checkQuota(userId, 'generation')).rejects.toThrow(
        `Free tier generation limit reached (${FREE_GENERATIONS_LIMIT}/day)`
      );
    });

    it('allows pro user with higher limits', async () => {
      mockedDb.query.users.findFirst.mockResolvedValue({
        user_id: userId,
        subscription_status: 'active',
      });

      mockedDb.query.user_quotas.findFirst.mockResolvedValue({
        ai_generations_count: 500,
        last_reset_date: now,
      });

      await expect(checkQuota(userId, 'generation')).resolves.toBe(true);
    });

    it('throws error if user not found', async () => {
      mockedDb.query.users.findFirst.mockResolvedValue(undefined);

      await expect(checkQuota(userId, 'chat')).rejects.toThrow('User not found');
    });

    it('resets quota on new day', async () => {
      const oldDate = new Date('2025-12-25T10:00:00Z');

      mockedDb.query.users.findFirst.mockResolvedValue({
        user_id: userId,
        subscription_status: 'free',
      });

      mockedDb.query.user_quotas.findFirst.mockResolvedValue({
        user_id: userId,
        ai_generations_count: 10,
        ai_chat_count: 20,
        last_reset_date: oldDate,
        storage_usage: 1024,
      });

      // Correct chain mocking for Drizzle
      const mockSet = vi.fn().mockResolvedValue(undefined);

      const mockInsert = vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          onConflictDoUpdate: vi.fn().mockImplementation((config: any) => {
            expect(config.target).toBe(user_quotas.user_id);
            expect(config.set).toEqual({
              ai_generations_count: 0,
              ai_chat_count: 0,
              last_reset_date: now,
            });
            return { set: mockSet };
          }),
        }),
      });

      mockedDb.insert.mockImplementation(mockInsert);

      await checkQuota(userId, 'generation');

      expect(mockedDb.insert).toHaveBeenCalledWith(user_quotas);
      expect(mockInsert().values).toHaveBeenCalledWith({
        user_id: userId,
        ai_generations_count: 0,
        ai_chat_count: 0,
        last_reset_date: now,
      });
    });

    it('creates new quota record if none exists', async () => {
      mockedDb.query.users.findFirst.mockResolvedValue({
        user_id: userId,
        subscription_status: 'pro',
      });

      mockedDb.query.user_quotas.findFirst.mockResolvedValue(null);

      const mockInsert = vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          onConflictDoUpdate: vi.fn().mockReturnThis(),
        }),
      });

      mockedDb.insert.mockImplementation(mockInsert);

      await checkQuota(userId, 'chat');

      expect(mockedDb.insert).toHaveBeenCalledWith(user_quotas);
      expect(mockInsert().values).toHaveBeenCalledWith({
        user_id: userId,
        ai_generations_count: 0,
        ai_chat_count: 0,
        last_reset_date: now,
      });
    });
  });

  describe('incrementQuota', () => {
    it('increments generation count correctly', async () => {
      const mockWhere = vi.fn().mockResolvedValue(undefined);
      const mockSet = vi.fn().mockReturnValue({ where: mockWhere });

      mockedDb.update.mockReturnValue({ set: mockSet });

      await incrementQuota(userId, 'generation');

      expect(mockedDb.update).toHaveBeenCalledWith(user_quotas);
      expect(mockSet).toHaveBeenCalledWith({
        ai_generations_count: expect.anything(),
        ai_chat_count: undefined,
      });
      expect(mockWhere).toHaveBeenCalledWith(eq(user_quotas.user_id, userId));
    });

    it('increments chat count correctly', async () => {
      const mockWhere = vi.fn().mockResolvedValue(undefined);
      const mockSet = vi.fn().mockReturnValue({ where: mockWhere });

      mockedDb.update.mockReturnValue({ set: mockSet });

      await incrementQuota(userId, 'chat');

      expect(mockedDb.update).toHaveBeenCalledWith(user_quotas);
      expect(mockSet).toHaveBeenCalledWith({
        ai_generations_count: undefined,
        ai_chat_count: expect.anything(),
      });
      expect(mockWhere).toHaveBeenCalledWith(eq(user_quotas.user_id, userId));
    });
  });
});