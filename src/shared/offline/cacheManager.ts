import { getDB } from './db'

/**
 * Cache themes locally for offline access.
 * Uses stale-while-revalidate strategy.
 */
export async function cacheThemes(
  themes: Array<{
    id: string
    name: string
    fields: string
    createdBy: string
    usageCount: number
    isDefault: boolean
    createdAt: string
    updatedAt: string
  }>,
): Promise<void> {
  const db = await getDB()
  const tx = db.transaction('themes', 'readwrite')
  for (const theme of themes) {
    await tx.store.put(theme)
  }
  await tx.done
}

export async function getCachedThemes() {
  const db = await getDB()
  return db.getAll('themes')
}

/**
 * Cache chat sessions for offline viewing.
 */
export async function cacheChatSessions(
  sessions: Array<{
    id: string
    userId: string
    themeId: string
    title: string
    status: string
    messageCount: number
    createdAt: string
    updatedAt: string
  }>,
): Promise<void> {
  const db = await getDB()
  const tx = db.transaction('chatSessions', 'readwrite')
  for (const session of sessions) {
    await tx.store.put(session)
  }
  await tx.done
}

export async function getCachedChatSessions(userId: string) {
  const db = await getDB()
  return db.getAllFromIndex('chatSessions', 'by-userId', userId)
}

/**
 * Cache chat messages for a session.
 */
export async function cacheChatMessages(
  messages: Array<{
    id: string
    sessionId: string
    role: string
    content: string
    images: string[]
    timestamp: string
  }>,
): Promise<void> {
  const db = await getDB()
  const tx = db.transaction('chatMessages', 'readwrite')
  for (const msg of messages) {
    await tx.store.put(msg)
  }
  await tx.done
}

export async function getCachedChatMessages(sessionId: string) {
  const db = await getDB()
  return db.getAllFromIndex('chatMessages', 'by-sessionId', sessionId)
}

/**
 * Cache saved data records.
 */
export async function cacheSavedData(
  records: Array<{
    id: string
    themeId: string
    title: string
    content: string
    markdownContent: string
    images: string[]
    createdBy: string
    createdAt: string
    updatedAt: string
  }>,
): Promise<void> {
  const db = await getDB()
  const tx = db.transaction('savedData', 'readwrite')
  for (const record of records) {
    await tx.store.put(record)
  }
  await tx.done
}

export async function getCachedSavedData() {
  const db = await getDB()
  return db.getAll('savedData')
}
