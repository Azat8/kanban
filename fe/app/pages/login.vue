<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card max-width="420" class="pa-6">
      <v-card-title class="text-h6 mb-2">Login</v-card-title>

      <v-form ref="form" v-model="valid" @submit.prevent="loginUser">
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          :rules="[
            (v) => !!v || 'Email is required',
            (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
          ]"
          required
        />

        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          :rules="[
            (v) => !!v || 'Password is required',
            (v) => v.length >= 6 || 'Minimum 6 characters',
          ]"
          required
        />

        <v-alert
          v-if="error"
          type="error"
          class="mt-3"
          variant="tonal"
          density="compact"
        >
          {{ error }}
        </v-alert>

        <v-card-actions class="mt-4">
          <v-btn text @click="goToRegister">Don't have an account?</v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            type="submit"
            :loading="loading"
            :disabled="!valid || loading"
          >
            Login
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { VForm } from 'vuetify/components';
import { useAuth } from '~/composables/useAuth';
import authMiddleware from '~/middleware/auth.global';

definePageMeta({ layout: 'default', middleware: authMiddleware });

const router = useRouter();
const form = ref<InstanceType<typeof VForm> | null>(null);
const valid = ref(false);

const email = ref('');
const password = ref('');

const error = ref('');
const loading = ref(false);

// Access the composable
const { login } = useAuth();

function goToRegister() {
  router.push('/register');
}

async function loginUser() {
  const formEl = form.value;
  if (!formEl) return;

  const { valid: isValid } = await formEl.validate();
  if (!isValid) return;

  loading.value = true;
  error.value = '';

  try {
    await login(email.value, password.value);
  } catch (err: any) {
    error.value = err?.message || 'Registration failed. Please try again.';
  } finally {
    loading.value = false;
  }
}
</script>
