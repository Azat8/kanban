<template>
  <v-row>
    <v-col cols="4">
      <h3>TODO</h3>
      <draggable v-model="tasks.TODO" group="tasks" @end="onDragEnd">
        <template #item="{ element }">
          <v-card class="mb-2 p-2">
            {{ element.title }} — {{ element.assignedUser }}
          </v-card>
        </template>
      </draggable>
    </v-col>

    <v-col cols="4">
      <h3>IN_PROGRESS</h3>
      <draggable v-model="tasks.IN_PROGRESS" group="tasks" @end="onDragEnd">
        <template #item="{ element }">
          <v-card class="mb-2 p-2">
            {{ element.title }} — {{ element.assignedUser }}
          </v-card>
        </template>
      </draggable>
    </v-col>

    <v-col cols="4">
      <h3>DONE</h3>
      <draggable v-model="tasks.DONE" group="tasks" @end="onDragEnd">
        <template #item="{ element }">
          <v-card class="mb-2 p-2">
            {{ element.title }} — {{ element.assignedUser }}
          </v-card>
        </template>
      </draggable>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable';
import { reactive } from 'vue';

// Mock tasks grouped by status
const tasks = reactive({
  TODO: [
    { id: 1, title: 'Task 1', assignedUser: 'John' },
    { id: 2, title: 'Task 2', assignedUser: 'Jane' },
  ],
  IN_PROGRESS: [{ id: 3, title: 'Task 3', assignedUser: 'Alice' }],
  DONE: [{ id: 4, title: 'Task 4', assignedUser: 'Bob' }],
});

// Called after dragging ends
function onDragEnd(evt: any) {
  console.log('Drag ended', evt);
  // Here you can send updated status/order to your backend
}
</script>
