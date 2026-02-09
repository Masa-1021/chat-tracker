import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAmplifyClient } from '@/lib/amplifyClient'
import { useAuthStore } from '@/features/auth/stores/authStore'
import type { ChatSession, ChatMessage, SessionStatus } from '@/types'

const SESSION_KEY = ['chatSessions'] as const
const MESSAGES_KEY = ['chatMessages'] as const

interface AmplifySessionItem {
  id?: string | null
  userId?: string | null
  themeId?: string | null
  title?: string | null
  titleLocked?: boolean | null
  status?: SessionStatus | null
  messageCount?: number | null
  createdAt?: string | null
  updatedAt?: string | null
}

function mapSession(item: AmplifySessionItem): ChatSession {
  return {
    id: item.id as string,
    userId: item.userId as string,
    themeId: item.themeId as string,
    title: item.title as string,
    titleLocked: item.titleLocked ?? false,
    status: item.status ?? 'ACTIVE',
    messageCount: item.messageCount ?? 0,
    createdAt: item.createdAt as string,
    updatedAt: item.updatedAt as string,
  }
}

interface AmplifyMessageItem {
  id?: string | null
  sessionId?: string | null
  role?: 'USER' | 'ASSISTANT' | null
  content?: string | null
  images?: (string | null)[] | null
  isStreaming?: boolean | null
  timestamp?: string | null
}

function mapMessage(item: AmplifyMessageItem): ChatMessage {
  return {
    id: item.id as string,
    sessionId: item.sessionId as string,
    role: item.role as 'USER' | 'ASSISTANT',
    content: item.content as string,
    images: item.images?.filter((img): img is string => img !== null) ?? [],
    isStreaming: item.isStreaming ?? false,
    timestamp: item.timestamp as string,
  }
}

/** List user's chat sessions */
export function useChatSessions() {
  const user = useAuthStore((s) => s.user)

  return useQuery({
    queryKey: [...SESSION_KEY, user?.id],
    queryFn: async () => {
      if (!user) return []
      const client = getAmplifyClient()
      const { data, errors } =
        await client.models.ChatSession.listChatSessionByUserIdAndUpdatedAt(
          { userId: user.id },
          { sortDirection: 'DESC' },
        )
      if (errors) throw new Error(errors[0].message)
      return data.map((item: AmplifySessionItem) => mapSession(item))
    },
    enabled: !!user,
  })
}

/** Get a single session by ID */
export function useChatSession(sessionId: string | undefined) {
  return useQuery({
    queryKey: [...SESSION_KEY, sessionId],
    queryFn: async () => {
      if (!sessionId) return null
      const client = getAmplifyClient()
      const { data, errors } = await client.models.ChatSession.get({
        id: sessionId,
      })
      if (errors) throw new Error(errors[0].message)
      if (!data) return null
      return mapSession(data as AmplifySessionItem)
    },
    enabled: !!sessionId,
  })
}

/** Get messages for a session */
export function useChatMessages(sessionId: string | undefined) {
  return useQuery({
    queryKey: [...MESSAGES_KEY, sessionId],
    queryFn: async () => {
      if (!sessionId) return []
      const client = getAmplifyClient()
      const { data, errors } =
        await client.models.ChatMessage.listChatMessageBySessionIdAndTimestamp(
          { sessionId },
          { sortDirection: 'ASC' },
        )
      if (errors) throw new Error(errors[0].message)
      return data.map((item: AmplifyMessageItem) => mapMessage(item))
    },
    enabled: !!sessionId,
  })
}

/** Create a new chat session */
export function useCreateSession() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: async ({
      themeId,
      title,
    }: {
      themeId: string
      title?: string
    }) => {
      if (!user) throw new Error('Not authenticated')
      const client = getAmplifyClient()
      const { data, errors } = await client.models.ChatSession.create({
        userId: user.id,
        themeId,
        title: title ?? '新しいチャット',
        titleLocked: false,
        status: 'ACTIVE',
        messageCount: 0,
      })
      if (errors) throw new Error(errors[0].message)
      return mapSession(data as AmplifySessionItem)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_KEY })
    },
  })
}

/** Send a message (calls chatHandler Lambda via AppSync) */
export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      sessionId,
      content,
      images,
    }: {
      sessionId: string
      content: string
      images?: string[]
    }) => {
      const client = getAmplifyClient()

      // Save user message via AppSync mutation
      const userMsg = await client.models.ChatMessage.create({
        sessionId,
        role: 'USER',
        content,
        images: images ?? [],
        isStreaming: false,
        timestamp: new Date().toISOString(),
      })
      if (userMsg.errors) throw new Error(userMsg.errors[0].message)

      return {
        userMessage: mapMessage(userMsg.data as AmplifyMessageItem),
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...MESSAGES_KEY, variables.sessionId],
      })
      queryClient.invalidateQueries({ queryKey: SESSION_KEY })
    },
  })
}

/** Delete a chat session */
export function useDeleteSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const client = getAmplifyClient()
      const { errors } = await client.models.ChatSession.delete({
        id: sessionId,
      })
      if (errors) throw new Error(errors[0].message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_KEY })
    },
  })
}

/** Update session title */
export function useUpdateSessionTitle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      sessionId,
      title,
    }: {
      sessionId: string
      title: string
    }) => {
      const client = getAmplifyClient()
      const { errors } = await client.models.ChatSession.update({
        id: sessionId,
        title,
        titleLocked: true,
      })
      if (errors) throw new Error(errors[0].message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_KEY })
    },
  })
}
