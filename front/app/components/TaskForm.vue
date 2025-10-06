<template>
  <v-dialog :model-value="isOpen" @update:model-value="updateOpen" max-width="500">
    <v-card>
      <v-card-title>Create Task</v-card-title>
      <v-card-text>
        <v-text-field v-model="title" label="Title" required />
        <v-textarea v-model="description" label="Description" />
        <v-select v-model="assignedUser" :items="users" item-text="name" label="Assign User" required />
        <v-select v-model="status" :items="statuses" label="Status" required />
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="close">Cancel</v-btn>
        <v-btn color="primary" @click="submitTask">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['update:isOpen']);

const title = ref('');
const description = ref('');
const assignedUser = ref('');
const status = ref('TODO');

// Mock data
const users = ref([{ name: 'John' }, { name: 'Jane' }]);
const statuses = ['TODO', 'IN_PROGRESS', 'DONE'];

function updateOpen(val: boolean) {
  emit('update:isOpen', val);
}

function close() {
  emit('update:isOpen', false);
}

function submitTask() {
  console.log({
    title: title.value,
    description: description.value,
    assignedUser: assignedUser.value,
    status: status.value
  });
  close();
}
</script>
