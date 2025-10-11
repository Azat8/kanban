<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card max-width="420" class="pa-6">
      <v-card-title class="text-h6 mb-2">Create Account</v-card-title>

      <v-form ref="form" v-model="valid" @submit.prevent="registerUser">
        <v-select
          v-model="role"
          :items="roles"
          label="Role"
          required
        />
        <v-text-field
          v-model="name"
          label="Full Name"
          :rules="[(v) => !!v || 'Name is required']"
          required
        />

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

        <v-card-actions class="mt-4 d-flex flex-column">
          <v-btn text @click="goToLogin">Already have an account?</v-btn>
          <v-spacer />
          <v-btn
            class="mt-2"
            color="primary"
            type="submit"
            :loading="loading"
            :disabled="!valid || loading"
          >
            Register
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

const name = ref('');
const email = ref('');
const password = ref('');

const error = ref('');
const loading = ref(false);

const roles = ['manager', 'employee'];
const role = ref('employee');

// Access the composable
const { register } = useAuth();

function goToLogin() {
  router.push('/login');
}

async function registerUser() {
  const formEl = form.value;
  if (!formEl) return;

  const { valid: isValid } = await formEl.validate();
  if (!isValid) return;

  loading.value = true;
  error.value = '';

  try {
    await register(name.value, email.value, password.value, role.value);
  } catch (err: any) {
    error.value = err?.message || 'Registration failed. Please try again.';
  } finally {
    loading.value = false;
  }
}
</script>
