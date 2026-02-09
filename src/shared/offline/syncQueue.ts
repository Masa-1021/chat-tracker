import { getDB } from './db'

interface QueueItem {
  action: string
  model: string
  payload: string
  createdAt: string
  retryCount: number
}

const MAX_RETRIES = 3

/**
 * Add an action to the offline sync queue.
 */
export async function enqueueAction(
  action: string,
  model: string,
  payload: Record<string, unknown>,
): Promise<void> {
  const db = await getDB()
  await db.add('syncQueue', {
    action,
    model,
    payload: JSON.stringify(payload),
    createdAt: new Date().toISOString(),
    retryCount: 0,
  })
}

/**
 * Get all pending sync actions.
 */
export async function getPendingActions(): Promise<
  Array<QueueItem & { id: number }>
> {
  const db = await getDB()
  const items = await db.getAll('syncQueue')
  return items as Array<QueueItem & { id: number }>
}

/**
 * Remove a processed action from the queue.
 */
export async function dequeueAction(id: number): Promise<void> {
  const db = await getDB()
  await db.delete('syncQueue', id)
}

/**
 * Increment retry count for a failed action.
 */
export async function incrementRetry(id: number): Promise<boolean> {
  const db = await getDB()
  const item = await db.get('syncQueue', id)
  if (!item) return false

  if (item.retryCount >= MAX_RETRIES - 1) {
    // Max retries reached, remove from queue
    await db.delete('syncQueue', id)
    return false // Indicates failure
  }

  await db.put('syncQueue', {
    ...item,
    retryCount: item.retryCount + 1,
  })
  return true // Indicates retry scheduled
}

/**
 * Process the sync queue when back online.
 * Returns number of failed items.
 */
export async function processSyncQueue(
  processor: (item: {
    action: string
    model: string
    payload: Record<string, unknown>
  }) => Promise<void>,
): Promise<number> {
  const items = await getPendingActions()
  let failedCount = 0

  for (const item of items) {
    try {
      await processor({
        action: item.action,
        model: item.model,
        payload: JSON.parse(item.payload) as Record<string, unknown>,
      })
      await dequeueAction(item.id)
    } catch {
      const canRetry = await incrementRetry(item.id)
      if (!canRetry) {
        failedCount++
      }
    }
  }

  return failedCount
}
