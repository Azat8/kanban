import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

export function useAuth() {
  const auth = useAuthStore();
  const router = useRouter();

  async function authRequest(endpoint: string, body: Record<string, any>) {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/${endpoint}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || `${endpoint} failed`);
    }

    const data = await res.json();
    auth.setToken(data.access_token);
    router.push('/');
  }

  const login = (email: string, password: string) =>
    authRequest('login', { email, password });

  const register = (
    name: string,
    email: string,
    password: string,
    role: string
  ) => authRequest('register', { name, email, password, role });

  const logout = () => {
    auth.logout();
    router.push('/login');
  };

  return { login, register, logout };
}
