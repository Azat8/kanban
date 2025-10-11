<template>
  <div class="kanban-scroll flex-grow-1 h-100">
    <div class="flex-grow-1 no-gutters fill-height d-flex flex-row">
      <div
        v-for="status in statuses"
        :key="status"
        class="d-flex min-h-0 mr-3 col-item"
      >
        <div
          class="rounded-lg border m-3 d-flex flex-column flex-grow-1 min-h-0"
        >
          <div
            class="pa-3 font-weight-medium sticky-header rounded-lg bg-white d-flex justify-space-between align-items-center"
          >
            <span>{{ TASK_STATUS_LABELS[status] }}</span>
            <v-btn
              variant="text"
              density="compact"
              icon="mdi-plus"
              v-if="!isEmployee"
              @click="actions.openTask({ status })"
            ></v-btn>
          </div>
          <div
            class="flex-grow-1 overflow-y-auto min-h-0 h-0 pa-2 col-y-scroll"
          >
            <draggable
              :list="tasks[status]"
              item-key="id"
              group="tasks"
              animation="200"
              ghost-class="drag-ghost"
              @change="(evt: any) => onDragEnd(evt, status)"
              :emptyInsertThreshold="100"
            >
              <template #item="{ element }">
                <div class="snap-item">
                  <v-card
                    class="mb-3 pa-3 rounded-lg transition-all cursor-pointer"
                    @click="actions.openTask(element)"
                    variant="tonal"
                  >
                    <v-card-title class="text-subtitle-1 font-weight-medium">
                      {{ element.title }}
                    </v-card-title>

                    <v-card-text class="text-body-2">
                      <div class="mb-2">
                        <div>{{ element.description || '—' }}</div>
                      </div>

                      <div class="mb-1">
                        <div>
                          <strong>Start:</strong>
                          {{ formatDate(element.startDate) }}
                        </div>
                        <div>
                          <strong>End:</strong>
                          {{ formatDate(element.endDate) }}
                        </div>
                      </div>

                      <div class="mb-1">
                        <strong>
                          {{ isEmployee ? 'Manager: ' : 'Employee: ' }}
                        </strong>
                        <span>
                          {{
                            isEmployee
                              ? element.createdBy?.name
                              : element.assignedUser?.name
                          }}
                        </span>
                      </div>
                    </v-card-text>

                    <v-card-actions v-if="!isEmployee">
                      <v-spacer />
                      <v-btn
                        color="error"
                        variant="text"
                        size="small"
                        @click.stop="actions.deleteTask(element.id)"
                      >
                        Delete
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable';
import { TASK_STATUS_LABELS } from '~/configs/taskConfig';

const statuses = Object.values(TaskStatus);
const props = defineProps<{
  tasks: Record<TaskStatus, Task[]>;
  actions: {
    openTask: (task: Task | Partial<Task>) => void;
    updateStatus: (id: number, status: TaskStatus) => void;
    deleteTask: (id: number) => void;
  };
  isEmployee: boolean;
}>();

async function onDragEnd(evt: any, newStatus: TaskStatus) {
  const movedTask: Task = evt.added?.element || evt.moved?.element;
  if (!movedTask) return;

  if (movedTask.status !== newStatus) {
    movedTask.status = newStatus;
    props.actions.updateStatus(movedTask.id, newStatus);
  }
}
</script>

<style scoped>
.kanban-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  width: 100%;
  scroll-snap-type: x mandatory;
}

.col-y-scroll {
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  height: 100%;
}

.snap-item {
  scroll-snap-align: start;
  margin-bottom: 0.5rem;
}

.col-y-scroll > * {
  scroll-snap-align: start;
}

.col-item {
  width: 250px;
  scroll-snap-align: start;
}

@media only screen and (max-width: 480px) {
  .col-item {
    width: 80vw;
    scroll-snap-align: start;
  }
}

.overflow-y-auto {
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1;
}
</style>
