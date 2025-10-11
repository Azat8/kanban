// ~/plugins/auth-cookie.ts
import { defineNuxtPlugin } from '#app';
import Cookies from 'js-cookie';

export default defineNuxtPlugin((nuxtApp) => {
  // Read token differently on server vs client
  const token = process.server
    ? nuxtApp.ssrContext?.event.node.req.headers.cookie
        ?.split('; ')
        .find((c) => c.startsWith('token='))
        ?.split('=')[1] || null
    : Cookies.get('token') || null;

  nuxtApp.provide('authToken', token);
});
