import { useQuery } from '@tanstack/vue-query';

export type User = {
  id: number;
  name: string;
  role: 'manager' | 'employee';
};

export type Employee = User & {
  available: boolean;
};

export const useCurrentUserQuery = () => {
  const { $api } = useNuxtApp();
  return useQuery({
    queryKey: ['user'] as const,
    queryFn: async () => {
      return await $api<User>('/user/me', {
        credentials: 'include',
      });
    },
  });
};

export const useEmployeesQuery = (
  paramsFn: () => { startDate?: string; endDate?: string; keyword?: string }
) => {
  const { $api } = useNuxtApp();

  return useQuery({
    queryKey: ['employees', paramsFn()],
    queryFn: async () => {
      const params = paramsFn();
      if (!params.startDate || !params.endDate) return [];
      return await $api<Employee[]>('/user/employees', {
        credentials: 'include',
        params,
      });
    },
  });
};

export const useUsersQuery = (
  paramsFn: () => { keyword?: string }
) => {
  const { $api } = useNuxtApp();

  return useQuery({
    queryKey: ['users', paramsFn()],
    queryFn: async () => {
      const params = paramsFn();
      return await $api<User[]>('/user', {
        credentials: 'include',
        params,
      });
    },
  });
};
