<template>
  <v-dialog :model-value="props.isOpen" @update:model-value="closeDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6">Confirm Deletion</v-card-title>
      <v-card-text>Are you sure you want to delete this task?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="handleCancel()">Cancel</v-btn>
        <v-btn color="error" @click="handleConfirm()">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
  onConfirm: () => Promise<void> | void;
}>();

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
}>();

function closeDialog() {
  emit('update:isOpen', false);
}

async function handleConfirm() {
  await props.onConfirm();
  closeDialog();
}

function handleCancel() {
  closeDialog();
}
</script>