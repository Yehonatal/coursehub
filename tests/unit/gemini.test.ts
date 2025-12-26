// tests/unit/gemini.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { debug } from '@/lib/logger';

const mockGetGenerativeModel = vi.fn();

vi.mock('@google/generative-ai', () => {
  const MockGenerativeAI = class {
    constructor(apiKey: string) {}
    getGenerativeModel = mockGetGenerativeModel;
  };

  return { GoogleGenerativeAI: MockGenerativeAI };
});

vi.mock('@/lib/logger', () => ({
  debug: vi.fn(),
}));

const mockedDebug = debug as ReturnType<typeof vi.fn>;

describe('getGeminiModel', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    delete process.env.GEMINI_API;
    delete process.env.GEMINI_MODEL;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('uses provided apiKey and modelName when given', async () => {
    const { getGeminiModel } = await import('@/lib/ai/gemini');

    const customKey = 'custom-key-123';
    const customModel = 'gemini-1.5-pro';

    getGeminiModel(customKey, customModel);

    expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: customModel });
    expect(mockedDebug).toHaveBeenCalledWith(expect.stringContaining('gemini-1.5-pro'));
    expect(mockedDebug).toHaveBeenCalledWith(expect.stringContaining('cust***'));
  });
  
  
  it('falls back to env GEMINI_API when no apiKey provided', async () => {
  process.env.GEMINI_API = 'env-key-456';

  vi.resetModules();
  const { getGeminiModel } = await import('@/lib/ai/gemini');

  getGeminiModel(); // no apiKey passed

  expect(mockedDebug).toHaveBeenCalledWith(expect.stringContaining('env-***'));
  expect(mockGetGenerativeModel).toHaveBeenCalled();
});

  it('throws error when no API key is available anywhere', async () => {
    vi.resetModules();
    const { getGeminiModel } = await import('@/lib/ai/gemini');

    expect(() => getGeminiModel()).toThrow('Missing Gemini API Key');
  });

  it('prioritizes explicit modelName over GEMINI_MODEL env var over default', async () => {
    const { getGeminiModel, DEFAULT_MODEL_NAME } = await import('@/lib/ai/gemini');

    process.env.GEMINI_MODEL = 'gemini-1.5-flash';

    getGeminiModel('key', 'gemini-1.5-pro-latest');
    expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-1.5-pro-latest' });

    vi.clearAllMocks();

    getGeminiModel('key');
    expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-1.5-flash' });

    vi.clearAllMocks();
    delete process.env.GEMINI_MODEL;

    getGeminiModel('key');
    expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: DEFAULT_MODEL_NAME });
  });

  it('logs the model name and masked API key', async () => {
    const { getGeminiModel } = await import('@/lib/ai/gemini');

    getGeminiModel('my-secret-api-key-xyz', 'gemini-test-model');

    expect(mockedDebug).toHaveBeenCalledTimes(1);
    expect(mockedDebug).toHaveBeenCalledWith(
      'Using Gemini model: gemini-test-model and key: my-s*** '
    );
  });
});

describe('pre-initialized model export', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  it('is initialized when GEMINI_API env var is set', async () => {
    process.env.GEMINI_API = 'valid-key';
    const { model: freshModel } = await import('@/lib/ai/gemini');

    expect(mockGetGenerativeModel).toHaveBeenCalled();
    expect(freshModel).not.toBeNull();
  });

  it('uses GEMINI_MODEL env var if present for pre-init', async () => {
    process.env.GEMINI_API = 'key';
    process.env.GEMINI_MODEL = 'gemini-1.5-pro';
    const { model: freshModel } = await import('@/lib/ai/gemini');

    expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-1.5-pro' });
    expect(freshModel).not.toBeNull();
  });

  it('is null when no GEMINI_API env var', async () => {
    delete process.env.GEMINI_API;
    const { model: freshModel } = await import('@/lib/ai/gemini');

    expect(freshModel).toBeNull();
  });
});