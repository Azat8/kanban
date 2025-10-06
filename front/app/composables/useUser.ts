import { useQuery } from "@tanstack/vue-query"

type User = {
  name: string;
}


export const useCurrentUserQuery = () => {
  const { $api } = useNuxtApp();
  return useQuery({
    queryKey: ['user'] as const,
    queryFn: async () => {
      return await $api<User>('/user/me', {
        credentials: 'include',
      })
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
  })
}