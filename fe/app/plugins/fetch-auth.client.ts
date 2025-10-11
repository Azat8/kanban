import { ofetch } from 'ofetch';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin((nuxtApp) => {
  // Get the runtime config which is the correct way to access environment variables
  const config = useRuntimeConfig();

  // Create a new, custom $fetch instance with interceptors
  const api = ofetch.create({
    baseURL: import.meta.env.VITE_API_URL,
    onRequest({ options }) {
      const auth = useAuthStore();
      if (auth.token) {
        // Use the 'set' method for safer header manipulation
        options.headers = new Headers(options.headers);
        options.headers.set('Authorization', `Bearer ${auth.token}`);
      }
    },
    // Optional: Add other interceptors here, like error handling
    onResponseError({ response }) {
      if (response.status === 401) {
        console.error('Authentication error!');
        // Example: Redirect to login page
        const auth = useAuthStore();
        auth.logout();
        const route = useRoute();
        if (route.path !== '/login') {
          nuxtApp.runWithContext(() => navigateTo('/login'));
        }
      }
    },
  });

  // Expose the new instance to the Nuxt app context
  // This makes it available as `$api` throughout your application
  return {
    provide: {
      api,
    },
  };
});