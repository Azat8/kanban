<template>
  <div class="flex min-h-screen">
    <aside class="w-64 bg-gray-100 p-4">
      <!-- Sidebar: links to Dashboard, Users, etc -->
      <nav>
        <NuxtLink to="/dashboard">Dashboard</NuxtLink>
        <NuxtLink to="/dashboard/users">Users</NuxtLink>
      </nav>
    </aside>
    <main class="flex-1 p-4">
      <NuxtPage />
    </main>
  </div>
</template>