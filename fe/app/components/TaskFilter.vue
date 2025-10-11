<template>
  <v-card class="mb-6 pa-4 rounded-lg border" variant="flat">
    <v-row align="center" dense>
      <v-col cols="12" md="11" class="d-md-flex d-none">
        <TaskFilterForm />
      </v-col>

      <v-col
        cols="12"
        md="1"
        class="d-flex justify-space-between justify-md-end align-center"
      >
        <div class="d-flex d-md-none mr-2">
          <v-btn
            prepend-icon="mdi-filter"
            variant="tonal"
            color="primary"
            @click="isMobileFilterSheetOpen = true"
          >
            Filters
          </v-btn>
        </div>
        <div>
          <v-btn-toggle
            v-model="isKanbanView"
            color="primary"
            mandatory
            variant="outlined"
            density="compact"
          >
            <v-btn
              :value="true"
              @click="toggleView(true)"
              icon="mdi-view-column-outline"
              title="Kanban Board"
            ></v-btn>
            <v-btn
              :value="false"
              @click="toggleView(false)"
              icon="mdi-format-list-bulleted"
              title="List View"
            ></v-btn>
          </v-btn-toggle>
          <v-btn
            class="ml-2"
            variant="text"
            density="compact"
            icon="mdi-plus"
            v-if="!props.isEmployee"
            @click="props.openCreateTaskModal"
          ></v-btn>
        </div>
      </v-col>
    </v-row>

    <v-bottom-sheet v-model="isMobileFilterSheetOpen" scrollable>
      <v-card title="Filter Options">
        <v-card-text>
          <v-container>
            <TaskFilterForm />
          </v-container>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="isMobileFilterSheetOpen = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>
  </v-card>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useFilterStore } from '~/stores/useFilterStore';
import TaskFilterForm from './TaskFilterForm.vue';

const filterStore = useFilterStore();
const { toggleView } = filterStore;
const { isKanbanView } = storeToRefs(filterStore);

const props = defineProps<{
  openCreateTaskModal: () => void;
  isEmployee: boolean;
}>();

const isMobileFilterSheetOpen = ref(false);
</script>
