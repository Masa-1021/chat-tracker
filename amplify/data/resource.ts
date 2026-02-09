import { a, defineData, type ClientSchema } from '@aws-amplify/backend'
import { chatHandler } from '../functions/chat-handler/resource'

const schema = a.schema({
  // ========== Custom Types ==========
  SendMessageResult: a.customType({
    id: a.string().required(),
    sessionId: a.string().required(),
    messageId: a.string().required(),
    content: a.string().required(),
  }),

  // ========== Custom Mutations ==========
  sendMessage: a
    .mutation()
    .arguments({
      sessionId: a.string().required(),
      content: a.string().required(),
      images: a.string().array(),
    })
    .returns(a.ref('SendMessageResult'))
    .handler(a.handler.function(chatHandler))
    .authorization((allow) => [allow.authenticated()]),

  // ========== User ==========
  User: a
    .model({
      email: a.string().required(),
      displayName: a.string().required(),
      role: a.enum(['ADMIN', 'MEMBER']),
      language: a.string().default('ja'),
      displayTheme: a.string().default('system'),
      favoriteThemes: a.hasMany('FavoriteTheme', 'userId'),
    })
    .authorization((allow) => [allow.authenticated()]),

  // ========== Theme ==========
  Theme: a
    .model({
      name: a.string().required(),
      fields: a.json().required(), // ThemeField[]
      createdBy: a.string().required(),
      usageCount: a.integer().default(0),
      isDefault: a.boolean().default(false),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      favorites: a.hasMany('FavoriteTheme', 'themeId'),
    })
    .authorization((allow) => [allow.authenticated()])
    .secondaryIndexes((index) => [index('createdBy').sortKeys(['createdAt'])]),

  FavoriteTheme: a
    .model({
      userId: a.string().required(),
      themeId: a.string().required(),
      createdAt: a.datetime(),
      user: a.belongsTo('User', 'userId'),
      theme: a.belongsTo('Theme', 'themeId'),
    })
    .authorization((allow) => [allow.authenticated()])
    .secondaryIndexes((index) => [
      index('userId').sortKeys(['createdAt']),
      index('themeId'),
    ]),

  // ========== Chat Session ==========
  ChatSession: a
    .model({
      userId: a.string().required(),
      themeId: a.string().required(),
      title: a.string().required(),
      titleLocked: a.boolean().default(false),
      status: a.enum(['ACTIVE', 'COMPLETED', 'DRAFT']),
      messageCount: a.integer().default(0),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      messages: a.hasMany('ChatMessage', 'sessionId'),
    })
    .authorization((allow) => [allow.authenticated()])
    .secondaryIndexes((index) => [
      index('userId').sortKeys(['updatedAt']),
      index('themeId').sortKeys(['updatedAt']),
    ]),

  ChatMessage: a
    .model({
      sessionId: a.string().required(),
      role: a.enum(['USER', 'ASSISTANT']),
      content: a.string().required(),
      images: a.string().array(),
      isStreaming: a.boolean().default(false),
      timestamp: a.datetime().required(),
      session: a.belongsTo('ChatSession', 'sessionId'),
    })
    .authorization((allow) => [allow.authenticated()])
    .secondaryIndexes((index) => [index('sessionId').sortKeys(['timestamp'])]),

  // ========== Streaming ==========
  StreamChunk: a
    .model({
      sessionId: a.string().required(),
      messageId: a.string().required(),
      chunkIndex: a.integer().required(),
      content: a.string().required(),
      isComplete: a.boolean().default(false),
      timestamp: a.datetime().required(),
    })
    .authorization((allow) => [allow.authenticated()])
    .secondaryIndexes((index) => [
      index('sessionId').sortKeys(['chunkIndex']),
    ]),

  // ========== Saved Data ==========
  SavedData: a
    .model({
      themeId: a.string().required(),
      sessionId: a.string(),
      title: a.string().required(),
      content: a.json().required(),
      markdownContent: a.string().required(),
      images: a.string().array().required(),
      createdBy: a.string().required(),
      isDeleted: a.boolean().default(false),
      deletedAt: a.datetime(),
      deletedBy: a.string(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      editHistory: a.hasMany('EditHistory', 'dataId'),
    })
    .authorization((allow) => [allow.authenticated()])
    .secondaryIndexes((index) => [
      index('themeId').sortKeys(['createdAt']),
      index('createdBy').sortKeys(['createdAt']),
      index('sessionId'),
    ]),

  EditHistory: a
    .model({
      dataId: a.string().required(),
      userId: a.string().required(),
      action: a.enum(['CREATE', 'UPDATE', 'DELETE']),
      changes: a.json().required(),
      snapshot: a.json().required(),
      timestamp: a.datetime().required(),
      savedData: a.belongsTo('SavedData', 'dataId'),
    })
    .authorization((allow) => [allow.authenticated()])
    .secondaryIndexes((index) => [index('dataId').sortKeys(['timestamp'])]),
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
})
