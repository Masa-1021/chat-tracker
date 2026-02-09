import { describe, it, expect, beforeEach, vi } from 'vitest'
import { enqueueAction, getPendingActions, dequeueAction, processSyncQueue } from './syncQueue'

// Mock idb - use in-memory store
const mockStore = new Map<number, Record<string, unknown>>()
let autoId = 0

vi.mock('./db', () => ({
  getDB: vi.fn().mockResolvedValue({
    add: vi.fn().mockImplementation((_store: string, item: Record<string, unknown>) => {
      autoId++
      const newItem = { ...item, id: autoId }
      mockStore.set(autoId, newItem)
      return Promise.resolve(autoId)
    }),
    getAll: vi.fn().mockImplementation(() => {
      return Promise.resolve([...mockStore.values()])
    }),
    get: vi.fn().mockImplementation((_store: string, key: number) => {
      return Promise.resolve(mockStore.get(key))
    }),
    put: vi.fn().mockImplementation((_store: string, item: Record<string, unknown>) => {
      mockStore.set(item.id as number, item)
      return Promise.resolve()
    }),
    delete: vi.fn().mockImplementation((_store: string, key: number) => {
      mockStore.delete(key)
      return Promise.resolve()
    }),
  }),
}))

describe('syncQueue', () => {
  beforeEach(() => {
    mockStore.clear()
    autoId = 0
  })

  it('enqueues and retrieves actions', async () => {
    await enqueueAction('create', 'ChatMessage', { content: 'hello' })
    const pending = await getPendingActions()
    expect(pending).toHaveLength(1)
    expect(pending[0].action).toBe('create')
    expect(pending[0].model).toBe('ChatMessage')
    expect(JSON.parse(pending[0].payload)).toEqual({ content: 'hello' })
  })

  it('dequeues actions', async () => {
    await enqueueAction('create', 'ChatMessage', { content: 'hello' })
    const pending = await getPendingActions()
    await dequeueAction(pending[0].id)
    const remaining = await getPendingActions()
    expect(remaining).toHaveLength(0)
  })

  it('processes queue successfully', async () => {
    await enqueueAction('create', 'ChatMessage', { content: 'hello' })
    await enqueueAction('update', 'SavedData', { title: 'test' })

    const processor = vi.fn().mockResolvedValue(undefined)
    const failed = await processSyncQueue(processor)

    expect(failed).toBe(0)
    expect(processor).toHaveBeenCalledTimes(2)
  })

  it('retries failed actions', async () => {
    await enqueueAction('create', 'ChatMessage', { content: 'hello' })

    const processor = vi.fn().mockRejectedValue(new Error('network error'))
    const failed = await processSyncQueue(processor)

    // First failure: retryCount goes to 1, not yet at max (3)
    expect(failed).toBe(0)
    const pending = await getPendingActions()
    expect(pending).toHaveLength(1)
    expect(pending[0].retryCount).toBe(1)
  })
})
