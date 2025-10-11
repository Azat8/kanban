<template>
  <div class="d-flex flex-column flex-grow-1 min-h-0">
    <TaskFilter
      :isEmployee="isEmployee"
      :openCreateTaskModal="() => openTask({ status: TaskStatus.TODO })"
    />

    <KanbanView
      v-if="isKanbanView"
      :tasks="tasks"
      :isEmployee="isEmployee"
      :actions="taskActions"
    ></KanbanView>

    <ListView
      v-else
      :tasks="tasksData || []"
      :isEmployee="isEmployee"
      :actions="taskActions"
    />

    <ConfirmDeleteDialog
      v-model:isOpen="isConfirmDeleteDialogOpen"
      :onConfirm="handleConfirmDelete"
    />
    <TaskForm
      v-if="!!selectedTask"
      v-model:isOpen="isTaskFormDialogOpen"
      :task="selectedTask"
    />
  </div>
</template>

<script setup lang="ts">
import {
  TaskStatus,
  useTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from '~/composables/useTask';
import { useCurrentUserQuery } from '~/composables/useUser';
import KanbanView from './KanbanView.vue';
import { STATUESES } from '~/configs/taskConfig';
import TaskForm from './TaskForm.vue';
import ConfirmDeleteDialog from './ConfirmDeleteDialog.vue';

useNotifications();

const selectedTask = ref<Task | Partial<Task> | null>(null);

const filterStore = useFilterStore();
const { isKanbanView } = storeToRefs(filterStore);

const { data: tasksData, refetch } = useTasksQuery();
const updateTask = useUpdateTaskMutation();
const deleteTaskMutation = useDeleteTaskMutation();
const { data: currentUser } = useCurrentUserQuery();

const isEmployee = computed(() => currentUser.value?.role === 'employee');

const isConfirmDeleteDialogOpen = ref(false);
const isTaskFormDialogOpen = ref(false);
const taskToDeleteId = ref<number | null>(null);

const tasks = reactive({
  [TaskStatus.TODO]: [] as Task[],
  [TaskStatus.IN_PROGRESS]: [] as Task[],
  [TaskStatus.DONE]: [] as Task[],
});

watchEffect(() => {
  if (!tasksData.value) return;
  for (const status of STATUESES) {
    tasks[status] = tasksData.value.filter((t) => t.status === status);
  }
});

async function handleConfirmDelete() {
  if (taskToDeleteId.value) {
    await deleteTaskMutation.mutateAsync(taskToDeleteId.value);
  }
  taskToDeleteId.value = null;
}

function openTask(task: Task | Partial<Task>) {
  selectedTask.value = task;
  isTaskFormDialogOpen.value = true;
}

const taskActions = {
  openTask,
  updateStatus: (id: number, status: TaskStatus) => {
    updateTask.mutateAsync({
      id,
      data: { status },
    });
    isTaskFormDialogOpen.value = false;
  },
  deleteTask: (id: number) => {
    taskToDeleteId.value = id;
    isConfirmDeleteDialogOpen.value = true;
  },
};
</script>

<style scoped>
:host {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}
</style>
