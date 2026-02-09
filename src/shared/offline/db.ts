import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

interface ChatTrackerDB extends DBSchema {
  themes: {
    key: string
    value: {
      id: string
      name: string
      fields: string // JSON
      createdBy: string
      usageCount: number
      isDefault: boolean
      createdAt: string
      updatedAt: string
    }
  }
  chatSessions: {
    key: string
    value: {
      id: string
      userId: string
      themeId: string
      title: string
      status: string
      messageCount: number
      createdAt: string
      updatedAt: string
    }
    indexes: {
      'by-userId': string
    }
  }
  chatMessages: {
    key: string
    value: {
      id: string
      sessionId: string
      role: string
      content: string
      images: string[]
      timestamp: string
    }
    indexes: {
      'by-sessionId': string
    }
  }
  savedData: {
    key: string
    value: {
      id: string
      themeId: string
      title: string
      content: string // JSON
      markdownContent: string
      images: string[]
      createdBy: string
      createdAt: string
      updatedAt: string
    }
    indexes: {
      'by-themeId': string
    }
  }
  syncQueue: {
    key: number
    value: {
      id?: number
      action: string
      model: string
      payload: string // JSON
      createdAt: string
      retryCount: number
    }
  }
}

const DB_NAME = 'ChatTrackerDB'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<ChatTrackerDB>> | null = null

export function getDB(): Promise<IDBPDatabase<ChatTrackerDB>> {
  if (!dbPromise) {
    dbPromise = openDB<ChatTrackerDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Themes store
        db.createObjectStore('themes', { keyPath: 'id' })

        // Chat Sessions store
        const sessionsStore = db.createObjectStore('chatSessions', {
          keyPath: 'id',
        })
        sessionsStore.createIndex('by-userId', 'userId')

        // Chat Messages store
        const messagesStore = db.createObjectStore('chatMessages', {
          keyPath: 'id',
        })
        messagesStore.createIndex('by-sessionId', 'sessionId')

        // Saved Data store
        const dataStore = db.createObjectStore('savedData', {
          keyPath: 'id',
        })
        dataStore.createIndex('by-themeId', 'themeId')

        // Sync Queue store (auto-increment key)
        db.createObjectStore('syncQueue', {
          keyPath: 'id',
          autoIncrement: true,
        })
      },
    })
  }
  return dbPromise
}
