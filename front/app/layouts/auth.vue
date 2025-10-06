<template>
  <v-app>
    <!-- Top Navbar -->
    <v-app-bar color="primary" dark flat>
      <v-toolbar-title>{{ userQuery.data.value?.name }}</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Main content -->
    <v-main>
      <v-container fluid class="pa-6">
        <NuxtPage />
      </v-container>
    </v-main>

    <!-- Optional Footer -->
    <v-footer color="primary" dark app>
      <v-col class="text-center white--text">
        &copy; {{ new Date().getFullYear() }} My App
      </v-col>
    </v-footer>
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
