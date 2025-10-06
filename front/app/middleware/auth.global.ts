import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  // if (!import.meta.client) return;
  const auth = useAuthStore();

  if (
    auth.isAuthenticated &&
    (to.path === '/login' || to.path === '/register')
  ) {
    return navigateTo('/dashboard');
  }

  if (!auth.isAuthenticated && to.path.startsWith('/dashboard')) {
    return navigateTo('/login');
  }
});
