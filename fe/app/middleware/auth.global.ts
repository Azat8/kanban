import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  // if (!import.meta.client) return;
  const auth = useAuthStore();

  if (
    auth.isAuthenticated &&
    (to.path === '/login' || to.path === '/register')
  ) {
    alert(auth.isAuthenticated);
    return navigateTo('/');
  }

  if (!auth.isAuthenticated && to.path === '/') {
    return navigateTo('/login');
  }
});
