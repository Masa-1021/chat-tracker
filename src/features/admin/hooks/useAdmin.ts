import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAmplifyClient } from '@/lib/amplifyClient'
import type { User, UserRole } from '@/types'

const USERS_KEY = ['adminUsers'] as const

function mapUser(item: Record<string, unknown>): User {
  return {
    id: item.id as string,
    email: item.email as string,
    displayName: item.displayName as string,
    role: (item.role as UserRole) ?? 'MEMBER',
    language: (item.language as string) ?? 'ja',
    displayTheme: (item.displayTheme as string) ?? 'system',
    createdAt: item.createdAt as string,
    updatedAt: item.updatedAt as string,
  }
}

/** List all users (admin only) */
export function useUserList() {
  return useQuery({
    queryKey: USERS_KEY,
    queryFn: async () => {
      const client = getAmplifyClient()
      const { data, errors } = await client.models.User.list()
      if (errors) throw new Error(errors[0].message)
      return data.map((item) => mapUser(item as Record<string, unknown>))
    },
  })
}

/** Update user role */
export function useUpdateUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string
      role: UserRole
    }) => {
      const client = getAmplifyClient()
      const { errors } = await client.models.User.update({
        id: userId,
        role,
      })
      if (errors) throw new Error(errors[0].message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY })
    },
  })
}
