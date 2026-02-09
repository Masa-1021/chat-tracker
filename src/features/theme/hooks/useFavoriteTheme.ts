import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAmplifyClient } from '@/lib/amplifyClient'
import { useAuthStore } from '@/features/auth/stores/authStore'

const QUERY_KEY = ['favoriteThemes'] as const

interface AmplifyFavoriteThemeItem {
  id?: string | null
  userId?: string | null
  themeId?: string | null
  createdAt?: string | null
}

export function useFavoriteThemes() {
  const user = useAuthStore((s) => s.user)

  return useQuery({
    queryKey: [...QUERY_KEY, user?.id],
    queryFn: async () => {
      if (!user) return []
      const client = getAmplifyClient()
      const { data, errors } =
        await client.models.FavoriteTheme.listFavoriteThemeByUserIdAndCreatedAt({
          userId: user.id,
        })
      if (errors) throw new Error(errors[0].message)
      return data.map((item: AmplifyFavoriteThemeItem) => ({
        id: item.id as string,
        userId: item.userId as string,
        themeId: item.themeId as string,
        createdAt: item.createdAt as string,
      }))
    },
    enabled: !!user,
  })
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: async ({
      themeId,
      favoriteId,
    }: {
      themeId: string
      favoriteId?: string
    }) => {
      if (!user) throw new Error('Not authenticated')
      const client = getAmplifyClient()

      if (favoriteId) {
        // Remove favorite
        const { errors } = await client.models.FavoriteTheme.delete({
          id: favoriteId,
        })
        if (errors) throw new Error(errors[0].message)
      } else {
        // Add favorite
        const { errors } = await client.models.FavoriteTheme.create({
          userId: user.id,
          themeId,
        })
        if (errors) throw new Error(errors[0].message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}
