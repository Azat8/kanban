import { VueQueryPlugin, QueryClient, hydrate, dehydrate } from '@tanstack/vue-query'

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient()

  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient })

  // Optional SSR hydration logic
  if (import.meta.server) {
    nuxtApp.hooks.hook('app:rendered', () => {
      nuxtApp.payload.vueQueryState = dehydrate(queryClient)
    })
  }

  if (import.meta.client && nuxtApp.payload.vueQueryState) {
    hydrate(queryClient, nuxtApp.payload.vueQueryState)
  }
})
