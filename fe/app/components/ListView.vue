<template>
  <v-data-table
    :headers="listHeaders"
    :items="tasks"
    item-key="id"
    class="elevation-1 rounded-lg"
    :no-data-text="'No tasks match the current filters.'"
  >
    <template v-slot:item.title="{ item }">
      <v-btn
        variant="text"
        color="primary"
        @click="actions.openTask(item)"
        class="text-none"
      >
        {{ item.title }}
      </v-btn>
    </template>

    <template v-slot:item.status="{ item }">
      <v-chip 
        :color="TASK_STATUS_COLORS[item.status]" 
        size="small" 
        label
        :class="{ 'cursor-pointer': isEmployee }"
        @click="actions.openTask(item)"
      >
        {{ TASK_STATUS_LABELS[item.status] }}
      </v-chip>
    </template>

    <template v-slot:item.startDate="{ item }">
      {{ formatDate(item.startDate) }}
    </template>
    <template v-slot:item.endDate="{ item }">
      {{ formatDate(item.endDate) }}
    </template>

    <template v-slot:item.actions="{ item }">
      <v-btn
        icon="mdi-pencil"
        size="small"
        color="info"
        variant="text"
        @click.stop="actions.openTask(item)"
        title="Edit Task"
      ></v-btn>
      
      <v-btn
        v-if="!isEmployee"
        icon="mdi-delete"
        size="small"
        color="error"
        variant="text"
        @click.stop="actions.deleteTask(item.id)"
        title="Delete Task"
      ></v-btn>
    </template>

    <template v-slot:bottom>
      </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { TASK_STATUS_COLORS, TASK_STATUS_LABELS } from '~/configs/taskConfig';
import { type Task, TaskStatus } from '~/composables/useTask';

// Add the import for a helper function to format dates
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
};

defineProps<{
  tasks: Task[];
  actions: {
    openTask: (task: Task) => void;
    updateStatus: (id: number, status: TaskStatus) => void;
    deleteTask: (id: number) => void;
  };
  isEmployee: boolean;
}>();

const listHeaders = [
  { title: 'Title', key: 'title', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Assigned To', key: 'assignedUser.name', sortable: true },
  { title: 'Manager', key: 'createdBy.name', sortable: true },
  { title: 'Start Date', key: 'startDate', sortable: true },
  { title: 'End Date', key: 'endDate', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
];
</script>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}
</style>