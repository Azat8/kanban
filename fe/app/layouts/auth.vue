<template>
  <v-app>
    <!-- Top Navbar -->
    <v-app-bar color="primary" dark flat>
      <v-app-bar-title>{{ userQuery.data.value?.name }}</v-app-bar-title>
      <template v-slot:append>
        <v-btn @click="logout">
          Logout
        </v-btn>
      </template>
    </v-app-bar>

    <!-- Main content -->
    <v-main class="d-flex flex-column fill-height">
      <v-container fluid class="pa-6 d-flex flex-column flex-grow-1 min-h-0">
        <NuxtPage />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useCurrentUserQuery } from '~/composables/useUser';
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

const userQuery = useCurrentUserQuery();
const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>
