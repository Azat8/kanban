<template>
  <v-row dense>
    <v-col cols="12" sm="12" md="5" lg="3">
      <v-text-field
        variant="plain"
        hide-details
        single-line
        clearable
        label="Search Title or Description"
        density="compact"
        prepend-inner-icon="mdi-magnify"
        @update:model-value="(v) => applyFilters({ search: v })"
      ></v-text-field>
    </v-col>
    <v-col cols="12" sm="12" md="6" lg="3">
      <v-select
        single-line
        variant="plain"
        label="Filter Status"
        density="compact"
        :items="STATUESES"
        :item-title="(s) => TASK_STATUS_LABELS[s]"
        :item-value="(s) => s"
        clearable
        hide-details
        prepend-inner-icon="mdi-list-status"
        @update:model-value="(v) => applyFilters({ status: v })"
        persistent-hint
      ></v-select>
    </v-col>
    <v-col cols="12" sm="12" md="6" lg="3">
      <v-autocomplete
        single-line
        v-model:search="userSearchTerm"
        variant="plain"
        density="compact"
        prepend-inner-icon="mdi-account"
        clearable
        hide-details
        placeholder="Select user"
        :items="usersList"
        item-title="name"
        item-value="id"
        :label="currentUser?.role === 'employee' ? 'Manager' : 'Employee'"
        :loading="isUsersLoading"
        hide-no-data
        hide-selected
        required
        @update:model-value="(v) => applyFilters({ user: v })"
      />
    </v-col>
    <v-col cols="12" sm="12" md="6" lg="3">
      <div class="d-flex">
        <v-text-field
          type="date"
          label="Start Date"
          variant="plain"
          density="compact"
          required
          hide-details
          clearable
          @update:model-value="(v) => applyFilters({ startDate: v })"
        />
        <v-text-field
          type="date"
          label="End Date"
          variant="plain"
          density="compact"
          required
          :min="filters?.startDate ?? undefined"
          hide-details
          clearable
          @update:model-value="(v) => applyFilters({ endDate: v })"
        />
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="tsx">
import { useDebounceFn } from '@vueuse/core';
import { STATUESES, TASK_STATUS_LABELS } from '~/configs/taskConfig';
import { useFilterStore } from '~/stores/useFilterStore';

const userSearchTerm = ref('');

const filterStore = useFilterStore();
const { setFilters } = filterStore;
const { filters } = storeToRefs(filterStore);
const { data: currentUser } = useCurrentUserQuery();
const {
  data: usersList,
  refetch: refetchUsers,
  isLoading: isUsersLoading,
} = useUsersQuery(() => ({ keyword: userSearchTerm.value }));

const applyFilters = useDebounceFn((filter: Partial<TaskFilters>) => {
  setFilters(filter);
}, 300);

const onUserSearch = useDebounceFn((val: string) => {
  userSearchTerm.value = val;
  refetchUsers();
}, 300);

watch(userSearchTerm, (val) => {
  onUserSearch(val);
});
</script>
