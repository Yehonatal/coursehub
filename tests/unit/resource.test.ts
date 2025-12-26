// tests/unit/resource.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { db } from '@/db';
import { resources as resourcesTable, ratings, comments, verification, users } from '@/db/schema';
import { eq, inArray, count, avg, desc } from 'drizzle-orm';
import {
  fetchResourceRows,
  fetchStatsByIds,
  mapResourceRows,
  createResource,
  type ResourceWithTags,
} from '@/lib/dal/resource-helpers'; // ← Your path
import { parseTags } from '@/utils/parser';

// Mock dependencies
vi.mock('@/db', () => ({
  db: {
    select: vi.fn(),
    from: vi.fn(),
    leftJoin: vi.fn(),
    where: vi.fn(),
    limit: vi.fn(),
    orderBy: vi.fn(),
    groupBy: vi.fn(),
    transaction: vi.fn(),
  },
}));

vi.mock('@/utils/parser');

const mockedDb = db as any;

// Chain all methods to return mockedDb
['select', 'from', 'leftJoin', 'where', 'limit', 'orderBy', 'groupBy'].forEach((method) => {
  vi.spyOn(mockedDb, method as any).mockReturnValue(mockedDb);
});

// Mock transaction
vi.spyOn(mockedDb, 'transaction').mockImplementation(async (fn: any) => {
  const mockTx = {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn(),
  };
  return fn(mockTx);
});

describe('Resource Module', () => {
  const mockUserId = 'user-123';
  const mockResourceId = 'res-456';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchResourceRows', () => {
    it('fetches resources with author and verifier joins', async () => {
      const mockRows = [
        {
          resource_id: mockResourceId,
          title: 'Test Resource',
          description: 'A test description',
          upload_date: new Date('2025-01-01'),
          uploader_id: mockUserId,
          course_code: 'CS101',
          semester: 'Fall 2025',
          university: 'Test University',
          file_url: 'https://example.com/file.pdf',
          resource_type: 'notes',
          mime_type: 'application/pdf',
          file_size: 1024,
          views_count: 100,
          downloads_count: 50,
          tags: 'cs,notes,exam',
          is_ai: false,
          is_verified: true,
          author_first: 'John',
          author_last: 'Doe',
          author_uni: 'Test University',
          verifier_first: 'Jane',
          verifier_last: 'Smith',
          verified_date: new Date('2025-01-02'),
        },
      ];

      mockedDb.orderBy.mockResolvedValue(mockRows);

      const result = await fetchResourceRows();

      expect(result).toEqual(mockRows);
    });

    it('returns empty array on error', async () => {
      mockedDb.orderBy.mockRejectedValue(new Error('DB error'));

      const result = await fetchResourceRows();

      expect(result).toEqual([]);
    });
  
  it('returns empty maps when no IDs provided', async () => {
      const result = await fetchStatsByIds([]);

      expect(result.ratingById.size).toBe(0);
      expect(result.commentById.size).toBe(0);
      expect(result.viewById.size).toBe(0);
      expect(result.downloadById.size).toBe(0);
    });

    it('handles errors gracefully', async () => {
      mockedDb.groupBy.mockRejectedValue(new Error('DB error'));

      const result = await fetchStatsByIds([mockResourceId]);

      expect(result.ratingById.size).toBe(0);
      expect(result.commentById.size).toBe(0);
      expect(result.viewById.size).toBe(0);
      expect(result.downloadById.size).toBe(0);
    });
  });

  describe('mapResourceRows', () => {
    it('maps DB rows to ResourceWithTags with stats and parsed tags', () => {
      vi.mocked(parseTags).mockReturnValue(['cs', 'notes', 'exam']);

      const rows = [
        {
          resource_id: mockResourceId,
          title: 'Test Resource',
          description: 'Description',
          upload_date: new Date('2025-01-01'),
          uploader_id: mockUserId,
          course_code: 'CS101',
          semester: 'Fall 2025',
          university: 'Test University',
          file_url: 'https://example.com/file.pdf',
          resource_type: 'notes',
          mime_type: 'application/pdf',
          file_size: 1024,
          views_count: 100,
          downloads_count: 50,
          tags: 'cs,notes,exam',
          is_ai: false,
          is_verified: true,
          author_first: 'John',
          author_last: 'Doe',
          author_uni: 'Test University',
          verifier_first: 'Jane',
          verifier_last: 'Smith',
          verified_date: new Date('2025-01-02'),
        },
      ];

      const stats = {
        ratingById: new Map([[mockResourceId, { average: 4.5, count: 10 }]]),
        viewById: new Map([[mockResourceId, 100]]),
        commentById: new Map([[mockResourceId, 5]]),
        downloadById: new Map([[mockResourceId, 50]]),
      };

      const result = mapResourceRows(rows, stats);

      expect(result[0]).toMatchObject({
        resource_id: mockResourceId,
        title: 'Test Resource',
        tags: ['cs', 'notes', 'exam'],
        author: { name: 'John Doe', university: 'Test University' },
        verifier: { name: 'Jane Smith', date: expect.any(String) },
        rating: 4.5,
        reviews: 10,
        views: 100,
        comments: 5,
        downloads: 50,
      });
    });

    it('handles missing author/verifier/stats', () => {
      vi.mocked(parseTags).mockReturnValue([]);

      const rows = [
        {
          resource_id: mockResourceId,
          title: 'No Author',
          description: null,
          upload_date: new Date(),
          uploader_id: mockUserId,
          course_code: 'CS101',
          semester: 'Fall',
          university: 'Unknown',
          file_url: 'url',
          resource_type: 'notes',
          mime_type: 'pdf',
          file_size: 0,
          views_count: null,
          downloads_count: null,
          tags: '',
          is_ai: false,
          is_verified: false,
          author_first: null,
          author_last: null,
          author_uni: null,
          verifier_first: null,
          verifier_last: null,
          verified_date: null,
        },
      ];

      const stats = {
        ratingById: new Map(),
        viewById: new Map(),
        commentById: new Map(),
        downloadById: new Map(),
      };

      const result = mapResourceRows(rows, stats);

      expect(result[0].author).toEqual({ name: 'null null' });
      expect(result[0].verifier).toBeUndefined();
      expect(result[0].rating).toBe(0);
      expect(result[0].reviews).toBe(0);
      expect(result[0].views).toBe(0);
      expect(result[0].comments).toBe(0);
      expect(result[0].downloads).toBe(0);
    });
  });

  describe('createResource', () => {
    it('creates a resource with tags and default values', async () => {
      const data = {
        uploader_id: mockUserId,
        course_code: 'CS101',
        semester: 'Fall 2025',
        university: 'Test University',
        title: 'New Resource',
        file_url: 'https://example.com/file.pdf',
        mime_type: 'application/pdf',
        file_size: 2048,
      };

      const tags = ['cs', 'new', 'test'];

      const mockInserted = { resource_id: mockResourceId, ...data, tags: 'cs,new,test' };

      const mockTx = {
        insert: vi.fn().mockReturnThis(),
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([mockInserted]),
      };

      mockedDb.transaction.mockImplementation(async (fn: any) => fn(mockTx));

      const result = await createResource(data, tags);

      expect(result).toEqual(mockInserted);
      expect(mockTx.insert).toHaveBeenCalledWith(resourcesTable);
      expect(mockTx.values).toHaveBeenCalledWith({
        ...data,
        tags: 'cs,new,test',
        is_ai: false,
        is_verified: false,
      });
    });
  });
});