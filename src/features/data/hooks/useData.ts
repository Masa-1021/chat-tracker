import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAmplifyClient } from '@/lib/amplifyClient'
import { useAuthStore } from '@/features/auth/stores/authStore'
import type { SavedData, EditHistory, DataFilters } from '@/types'

const DATA_KEY = ['savedData'] as const
const HISTORY_KEY = ['editHistory'] as const

interface AmplifySavedDataItem {
  id?: string | null
  themeId?: string | null
  sessionId?: string | null
  title?: string | null
  content?: string | number | boolean | object | null
  markdownContent?: string | null
  images?: (string | null)[] | null
  createdBy?: string | null
  isDeleted?: boolean | null
  deletedAt?: string | null
  deletedBy?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

interface AmplifyEditHistoryItem {
  id?: string | null
  dataId?: string | null
  userId?: string | null
  action?: 'CREATE' | 'UPDATE' | 'DELETE' | null
  changes?: string | number | boolean | object | null
  snapshot?: string | number | boolean | object | null
  timestamp?: string | null
}

function parseJsonObject(value: unknown): Record<string, unknown> {
  let parsed = value
  while (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed)
    } catch {
      return {}
    }
  }
  return (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed))
    ? (parsed as Record<string, unknown>)
    : {}
}

function mapSavedData(item: AmplifySavedDataItem): SavedData {
  const content = parseJsonObject(item.content) as Record<string, string | number>

  return {
    id: item.id as string,
    themeId: item.themeId as string,
    sessionId: item.sessionId ?? undefined,
    title: item.title as string,
    content,
    markdownContent: item.markdownContent ?? '',
    images: item.images?.filter((img): img is string => img !== null) ?? [],
    createdBy: item.createdBy as string,
    isDeleted: item.isDeleted ?? false,
    deletedAt: item.deletedAt ?? undefined,
    deletedBy: item.deletedBy ?? undefined,
    createdAt: item.createdAt as string,
    updatedAt: item.updatedAt as string,
  }
}

function mapEditHistory(item: AmplifyEditHistoryItem): EditHistory {
  const changes = parseJsonObject(item.changes)
  const snapshot = parseJsonObject(item.snapshot)

  return {
    id: item.id as string,
    dataId: item.dataId as string,
    userId: item.userId as string,
    action: item.action as 'CREATE' | 'UPDATE' | 'DELETE',
    changes,
    snapshot,
    timestamp: item.timestamp as string,
  }
}

/** List saved data with optional filtering */
export function useSavedDataList(filters?: Partial<DataFilters>) {
  return useQuery({
    queryKey: [...DATA_KEY, filters],
    queryFn: async () => {
      const client = getAmplifyClient()

      // Use theme index if themeId filter provided
      if (filters?.themeId) {
        const { data, errors } =
          await client.models.SavedData.listSavedDataByThemeIdAndCreatedAt(
            { themeId: filters.themeId },
            { sortDirection: 'DESC' },
          )
        if (errors) throw new Error(errors[0].message)
        return data
          .map((item: AmplifySavedDataItem) => mapSavedData(item))
          .filter((d) => !d.isDeleted)
      }

      // Use createdBy index if createdBy filter provided
      if (filters?.createdBy) {
        const { data, errors } =
          await client.models.SavedData.listSavedDataByCreatedByAndCreatedAt(
            { createdBy: filters.createdBy },
            { sortDirection: 'DESC' },
          )
        if (errors) throw new Error(errors[0].message)
        return data
          .map((item: AmplifySavedDataItem) => mapSavedData(item))
          .filter((d) => !d.isDeleted)
      }

      // Default: list all
      const { data, errors } = await client.models.SavedData.list()
      if (errors) throw new Error(errors[0].message)
      return data
        .map((item: AmplifySavedDataItem) => mapSavedData(item))
        .filter((d) => !d.isDeleted)
    },
  })
}

/** Get a single saved data by ID */
export function useSavedDataById(id: string | undefined) {
  return useQuery({
    queryKey: [...DATA_KEY, id],
    queryFn: async () => {
      if (!id) return null
      const client = getAmplifyClient()
      const { data, errors } = await client.models.SavedData.get({ id })
      if (errors) throw new Error(errors[0].message)
      if (!data) return null
      return mapSavedData(data as AmplifySavedDataItem)
    },
    enabled: !!id,
  })
}

/** Create saved data */
export function useCreateSavedData() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: async (input: {
      themeId: string
      sessionId?: string
      title: string
      content: Record<string, string | number>
      markdownContent: string
      images?: string[]
    }) => {
      if (!user) throw new Error('Not authenticated')
      const client = getAmplifyClient()

      const { data, errors } = await client.models.SavedData.create({
        themeId: input.themeId,
        sessionId: input.sessionId,
        title: input.title,
        content: JSON.stringify(input.content),
        markdownContent: input.markdownContent,
        images: input.images ?? [],
        createdBy: user.id,
        isDeleted: false,
      })
      if (errors) throw new Error(errors[0].message)

      // Create edit history (CREATE action)
      await client.models.EditHistory.create({
        dataId: (data as AmplifySavedDataItem).id as string,
        userId: user.id,
        action: 'CREATE',
        changes: JSON.stringify(input.content),
        snapshot: JSON.stringify(input.content),
        timestamp: new Date().toISOString(),
      })

      return mapSavedData(data as AmplifySavedDataItem)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DATA_KEY })
    },
  })
}

/** Update saved data */
export function useUpdateSavedData() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: async (input: {
      id: string
      title?: string
      content?: Record<string, string | number>
      markdownContent?: string
      images?: string[]
    }) => {
      if (!user) throw new Error('Not authenticated')
      const client = getAmplifyClient()

      const updateFields: Record<string, unknown> = { id: input.id }
      if (input.title !== undefined) updateFields.title = input.title
      if (input.content !== undefined)
        updateFields.content = JSON.stringify(input.content)
      if (input.markdownContent !== undefined)
        updateFields.markdownContent = input.markdownContent
      if (input.images !== undefined) updateFields.images = input.images

      const { data, errors } = await client.models.SavedData.update(
        updateFields as Parameters<
          typeof client.models.SavedData.update
        >[0],
      )
      if (errors) throw new Error(errors[0].message)

      // Create edit history (UPDATE action)
      await client.models.EditHistory.create({
        dataId: input.id,
        userId: user.id,
        action: 'UPDATE',
        changes: JSON.stringify(input),
        snapshot: JSON.stringify(
          (data as AmplifySavedDataItem).content,
        ),
        timestamp: new Date().toISOString(),
      })

      return mapSavedData(data as AmplifySavedDataItem)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DATA_KEY })
    },
  })
}

/** Soft-delete saved data */
export function useDeleteSavedData() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Not authenticated')
      const client = getAmplifyClient()

      const now = new Date().toISOString()
      const { errors } = await client.models.SavedData.update({
        id,
        isDeleted: true,
        deletedAt: now,
        deletedBy: user.id,
      })
      if (errors) throw new Error(errors[0].message)

      // Create edit history (DELETE action)
      await client.models.EditHistory.create({
        dataId: id,
        userId: user.id,
        action: 'DELETE',
        changes: JSON.stringify({ isDeleted: true }),
        snapshot: JSON.stringify({}),
        timestamp: now,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DATA_KEY })
    },
  })
}

/** Get edit history for a saved data record */
export function useEditHistory(dataId: string | undefined) {
  return useQuery({
    queryKey: [...HISTORY_KEY, dataId],
    queryFn: async () => {
      if (!dataId) return []
      const client = getAmplifyClient()
      const { data, errors } =
        await client.models.EditHistory.listEditHistoryByDataIdAndTimestamp(
          { dataId },
          { sortDirection: 'DESC' },
        )
      if (errors) throw new Error(errors[0].message)
      return data.map((item: AmplifyEditHistoryItem) => mapEditHistory(item))
    },
    enabled: !!dataId,
  })
}
