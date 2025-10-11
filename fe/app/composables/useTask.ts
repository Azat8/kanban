import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  startDate: string;
  endDate: string;
  assignedUser: {
    id: number;
    name: string;
  };
  createdAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  assignedUserId: number;
  status: TaskStatus;
  startDate: string;
  endDate: string;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {}

/**
 * GET /task — fetch all tasks
 */
export const useTasksQuery = () => {
  const { filters } = storeToRefs(useFilterStore());
  const { $api } = useNuxtApp();

  return useQuery({
    queryKey: ['tasks', filters.value],
    queryFn: async ({ queryKey }) => {
      const currentFilters = queryKey[1];
      const query = Object.fromEntries(
        Object.entries(currentFilters as object).filter(([_, v]) => v)
      );

      return await $api<Task[]>('/task', {
        credentials: 'include',
        query,
      });
    },
  });
};

/**
 * POST /task — create a new task
 */
export const useCreateTaskMutation = () => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTaskInput) => {
      return await $api<Task>('/task', {
        method: 'POST',
        body: data,
        credentials: 'include',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

/**
 * PATCH /task/:id — update a task
 */
export const useUpdateTaskMutation = () => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: number; data: UpdateTaskInput }) => {
      return await $api<Task>(`/task/${params.id}`, {
        method: 'PATCH',
        body: params.data,
        credentials: 'include',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

/**
 * DELETE /task/:id — remove a task
 */
export const useDeleteTaskMutation = () => {
  const { $api } = useNuxtApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await $api(`/task/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
