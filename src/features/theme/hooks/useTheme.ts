import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAmplifyClient } from '@/lib/amplifyClient'
import { useAuthStore } from '@/features/auth/stores/authStore'
import type { Theme, ThemeField } from '@/types'

const QUERY_KEY = ['themes'] as const

function parseJsonArray<T>(value: unknown): T[] {
  let parsed = value
  // Handle double-encoded JSON (string wrapped in string)
  while (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed)
    } catch {
      return []
    }
  }
  return Array.isArray(parsed) ? (parsed as T[]) : []
}

function mapTheme(raw: Record<string, unknown>): Theme {
  return {
    id: raw.id as string,
    name: raw.name as string,
    fields: parseJsonArray<ThemeField>(raw.fields),
    createdBy: raw.createdBy as string,
    usageCount: (raw.usageCount as number) ?? 0,
    isDefault: (raw.isDefault as boolean) ?? false,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  }
}

export function useThemeList() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const client = getAmplifyClient()
      const { data, errors } = await client.models.Theme.list()
      if (errors) throw new Error(errors[0].message)
      return data.map((item) => mapTheme(item as unknown as Record<string, unknown>))
    },
  })
}

export function useThemeById(id: string | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null
      const client = getAmplifyClient()
      const { data, errors } = await client.models.Theme.get({ id })
      if (errors) throw new Error(errors[0].message)
      if (!data) return null
      return mapTheme(data as unknown as Record<string, unknown>)
    },
    enabled: !!id,
  })
}

export function useCreateTheme() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: async (input: { name: string; fields: ThemeField[] }) => {
      const client = getAmplifyClient()
      const { data, errors } = await client.models.Theme.create({
        name: input.name,
        fields: JSON.stringify(input.fields),
        createdBy: user?.id ?? '',
        usageCount: 0,
        isDefault: false,
      })
      if (errors) throw new Error(errors[0].message)
      return mapTheme(data as unknown as Record<string, unknown>)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useUpdateTheme() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: {
      id: string
      name: string
      fields: ThemeField[]
    }) => {
      const client = getAmplifyClient()
      const { data, errors } = await client.models.Theme.update({
        id: input.id,
        name: input.name,
        fields: JSON.stringify(input.fields),
      })
      if (errors) throw new Error(errors[0].message)
      return mapTheme(data as unknown as Record<string, unknown>)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useDeleteTheme() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const client = getAmplifyClient()
      const { errors } = await client.models.Theme.delete({ id })
      if (errors) throw new Error(errors[0].message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}
