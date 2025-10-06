<template>
  <v-btn color="primary" @click="openTaskForm">Create Task</v-btn>
  <TaskForm v-model:isOpen="isTaskFormOpen" />
  <TaskBoard />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
});
import { ref } from 'vue';
import TaskForm from '~/components/TaskForm.vue';
import TaskBoard from '~/components/TaskBoard.vue';

const isTaskFormOpen = ref(false);

function openTaskForm() {
  isTaskFormOpen.value = true;
}
</script>
