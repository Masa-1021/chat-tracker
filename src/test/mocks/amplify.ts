import { vi } from 'vitest'

// Mock Amplify client for testing
export function createMockAmplifyClient() {
  const mockModels: Record<string, Record<string, ReturnType<typeof vi.fn>>> = {
    User: {
      list: vi.fn().mockResolvedValue({ data: [], errors: null }),
      get: vi.fn().mockResolvedValue({ data: null, errors: null }),
      create: vi.fn().mockResolvedValue({ data: {}, errors: null }),
      update: vi.fn().mockResolvedValue({ data: {}, errors: null }),
      delete: vi.fn().mockResolvedValue({ data: {}, errors: null }),
    },
    Theme: {
      list: vi.fn().mockResolvedValue({ data: [], errors: null }),
      get: vi.fn().mockResolvedValue({ data: null, errors: null }),
      create: vi.fn().mockResolvedValue({ data: {}, errors: null }),
      update: vi.fn().mockResolvedValue({ data: {}, errors: null }),
      delete: vi.fn().mockResolvedValue({ data: {}, errors: null }),
      listThemeByCreatedBy: vi.fn().mockResolvedValue({ data: [], errors: null }),
    },
    ChatSession: {
      list: vi.fn().mockResolvedValue({ data: [], errors: null }),
      get: vi.fn().mockResolvedValue({ data: null, errors: null }),
      create: vi.fn().mockResolvedValue({ data: {}, errors: null }),
      update: vi.fn().mockResolvedValue({ data: {}, errors: null }),
      delete: vi.fn().mockResolvedValue({ data: {}, errors: null }),
      listChatSessionByUserId: vi.fn().mockResolvedValue({ data: [], errors: null }),
    },
    ChatMessage: {
      list: vi.fn().mockResolvedValue({ data: [], errors: null }),
      create: vi.fn().mockResolvedValue({ data: {}, errors: null }),
      listChatMessageBySessionId: vi.fn().mockResolvedValue({ data: [], errors: null }),
    },
    SavedData: {
      list: vi.fn().mockResolvedValue({ data: [], errors: null }),
      get: vi.fn().mockResolvedValue({ data: null, errors: null }),
      create: vi.fn().mockResolvedValue({ data: {}, errors: null }),
      update: vi.fn().mockResolvedValue({ data: {}, errors: null }),
      listSavedDataByThemeId: vi.fn().mockResolvedValue({ data: [], errors: null }),
      listSavedDataByCreatedBy: vi.fn().mockResolvedValue({ data: [], errors: null }),
    },
    EditHistory: {
      create: vi.fn().mockResolvedValue({ data: {}, errors: null }),
      listEditHistoryByDataId: vi.fn().mockResolvedValue({ data: [], errors: null }),
    },
    FavoriteTheme: {
      create: vi.fn().mockResolvedValue({ data: {}, errors: null }),
      delete: vi.fn().mockResolvedValue({ data: {}, errors: null }),
      listFavoriteThemeByUserId: vi.fn().mockResolvedValue({ data: [], errors: null }),
    },
    StreamChunk: {
      onStreamChunkBySessionId: vi.fn().mockReturnValue({
        subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
      }),
    },
  }

  return { models: mockModels }
}

// Setup mock for amplifyClient module
export function setupAmplifyMock() {
  const mockClient = createMockAmplifyClient()
  vi.mock('@/lib/amplifyClient', () => ({
    getAmplifyClient: () => mockClient,
  }))
  return mockClient
}
