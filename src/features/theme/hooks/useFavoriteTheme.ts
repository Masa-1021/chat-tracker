import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAmplifyClient } from '@/lib/amplifyClient'
import { useAuthStore } from '@/features/auth/stores/authStore'

const QUERY_KEY = ['favoriteThemes'] as const

export function useFavoriteThemes() {
  const user = useAuthStore((s) => s.user)

  return useQuery({
    queryKey: [...QUERY_KEY, user?.id],
    queryFn: async () => {
      if (!user) return []
      const client = getAmplifyClient()
      const { data, errors } =
        await client.models.FavoriteTheme.listFavoriteThemeByUserId({
          userId: user.id,
        })
      if (errors) throw new Error(errors[0].message)
      return data.map((item) => ({
        id: item.id,
        userId: item.userId,
        themeId: item.themeId,
        createdAt: item.createdAt,
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
