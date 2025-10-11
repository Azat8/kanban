import { defineStore } from 'pinia';
import { reactive } from 'vue';

export interface TaskFilters {
  search: string;
  status: TaskStatus | null;
  user: number | null;
  startDate: string | null;
  endDate: string | null;
}

export const useFilterStore = defineStore('taskFilters', () => {
  const filters = reactive<TaskFilters>({
    search: '',
    status: null,
    user: null,
    endDate: null,
    startDate: null,
  });

  const isKanbanView = ref(true);

  const toggleView = (isKanban: boolean) => {
    isKanbanView.value = isKanban;
    if (isKanban) {
      filters.status = null;
    }
  };

  const setFilters = (newFilters: Partial<TaskFilters>) => {
    Object.assign(filters, newFilters);
  };

  return {
    filters,
    setFilters,
    isKanbanView,
    toggleView,
  };
});
