// ~/stores/auth.ts
import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';

import Cookies from 'js-cookie';

export const useAuthStore = defineStore('auth', () => {
  const nuxtApp = useNuxtApp();
  const token = ref<string | null>((nuxtApp.$authToken as string) || null);

  const isAuthenticated = computed(() => !!token.value);

  function setToken(newToken: string) {
    token.value = newToken;
    Cookies.set('token', newToken, {
      expires: 1,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });
  }

  function logout() {
    token.value = null;
    Cookies.remove('token');
  }

  return { token, isAuthenticated, setToken, logout };
});
