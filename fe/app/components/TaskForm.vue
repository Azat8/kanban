<template>
  <v-dialog
    :model-value="props.isOpen"
    max-width="500"
    @update:model-value="handleDialogUpdate"
  >
    <v-card>
      <v-card-title>
        {{ isEditMode ? 'Edit Task' : 'Create Task' }}
      </v-card-title>

      <v-card-text class="space-y-4">
        <v-alert
          v-if="errorMessage"
          type="error"
          border="start"
          variant="tonal"
          closable
          @click:close="errorMessage = null"
        >
          {{ errorMessage }}
        </v-alert>
        <v-text-field
          v-model="title"
          label="Title"
          required
          counter
          :disabled="isEmployee"
          :maxLength="50"
          hint="Max 50 chars."
        />

        <v-textarea
          v-model="description"
          label="Description"
          :disabled="isEmployee"
          :maxLength="500"
          hint="Max 500 chars."
          counter
        />

        <div class="flex gap-2">
          <v-text-field
            v-model="startDate"
            type="datetime-local"
            label="Start Date & Time"
            :max="endDate || undefined"
            required
            :disabled="isEmployee"
            :min="getNowDateTimeLocal()"
          />
          <v-text-field
            v-model="endDate"
            type="datetime-local"
            label="End Date & Time"
            required
            :disabled="isEmployee"
            :min="startDate || getNowDateTimeLocal()"
          />
        </div>

        <v-autocomplete
          v-model="assignedUser"
          :items="usersList"
          item-title="name"
          item-value="id"
          item-disabled="disabled"
          :return-object="true"
          label="Assign Employee"
          :disabled="isEmployee || isEditMode"
          :loading="isLoading"
          hide-no-data
          hide-selected
          single-line
          required
        />

        <v-select
          v-model="status"
          :items="STATUESES"
          :item-title="(s) => TASK_STATUS_LABELS[s]"
          :item-value="(s) => s"
          label="Status"
          required
        />
      </v-card-text>

      <v-card-actions>
        <v-btn text @click="isModalOpen = false">Cancel</v-btn>
        <v-btn color="primary" @click="submitTask" :loading="isSubmitting">
          {{ isEditMode ? 'Update' : 'Save' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { useEmployeesQuery, useCurrentUserQuery } from '~/composables/useUser';
import {
  TaskStatus,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  type CreateTaskInput,
} from '~/composables/useTask';
import { useDebounceFn } from '@vueuse/core';
import { STATUESES, TASK_STATUS_LABELS } from '~/configs/taskConfig';

const isModalOpen = defineModel<boolean>('isOpen', { required: true });

const props = defineProps<{
  isOpen: boolean;
  task: Task | Partial<Task>;
}>();

const emit = defineEmits<{
  'update:isOpen': [value: boolean];
}>();

const errorMessage = ref<string | null>(null);

const title = ref('');
const description = ref('');
const assignedUser = ref<any | null>(null);
const status = ref<TaskStatus>(TaskStatus.TODO);
const startDate = ref('');
const endDate = ref('');

const keyword = ref('');

const { data, refetch, isLoading } = useEmployeesQuery(() => ({
  startDate: startDate.value,
  endDate: endDate.value,
  keyword: keyword.value,
}));

const { data: currentUser } = useCurrentUserQuery();
const isEmployee = computed(() => currentUser.value?.role === 'employee');

const toInputDateTime = (value: string) =>
  dayjs(value).format('YYYY-MM-DDTHH:mm');

const isEditMode = computed(() => !!props.task?.id);

watch(
  () => props.task,
  (value) => {
    if (value) {
      title.value = value.title || '';
      description.value = value.description || '';
      assignedUser.value = value.assignedUser || null;
      status.value = value.status || TaskStatus.TODO;

      startDate.value = value.startDate ? toInputDateTime(value.startDate) : '';
      endDate.value = value.endDate ? toInputDateTime(value.endDate) : '';
    }
  },
  { immediate: true }
);

const usersList = computed(() => {
  if (!data.value) return [];
  return data.value.map((u) => ({
    ...u,
    props: {
      disabled:
        !u.available || (isEditMode.value && u.id !== assignedUser.value?.id),
    },
  }));
});

const debouncedRefetch = useDebounceFn(() => {
  if (startDate.value && endDate.value) refetch();
}, 300);

watch(() => [startDate.value, endDate.value, keyword.value], debouncedRefetch);

const createTask = useCreateTaskMutation();
const updateTask = useUpdateTaskMutation();
const isSubmitting = ref(false);

async function submitTask() {
  if (!assignedUser.value || !startDate.value || !endDate.value) return;

  const payload = {
    title: title.value,
    description: description.value,
    assignedUserId: assignedUser.value.id,
    status: status.value,
    startDate: startDate.value,
    endDate: endDate.value,
  };

  isSubmitting.value = true;
  errorMessage.value = null;

  try {
    if (isEditMode.value) {
      await updateTask.mutateAsync({
        id: props.task.id as number,
        data: payload,
      });
    } else {
      await createTask.mutateAsync(payload as CreateTaskInput);
    }

    closeModal();
  } catch (err: any) {
    if (err?.data?.message) {
      errorMessage.value = Array.isArray(err.data.message)
        ? err.data.message.join(', ')
        : err.data.message;
    } else if (err?.message) {
      errorMessage.value = err.message;
    } else {
      errorMessage.value = 'An unexpected error occurred';
    }
  } finally {
    isSubmitting.value = false;
  }
}

function getNowDateTimeLocal() {
  return dayjs().format('YYYY-MM-DDTHH:mm');
}

function closeModal() {
  emit('update:isOpen', false);
}

function handleDialogUpdate(isOpen: boolean) {
  if (!isOpen) {
    closeModal();
  }
}
</script>
