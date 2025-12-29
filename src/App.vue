<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import ListDevices from '@/views/ListDevices.vue';
import ListReservations from '@/views/ListReservations.vue';

const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
const returnTo = typeof window !== 'undefined' ? window.location.origin : '/';

function handleLogin() {
  loginWithRedirect({
    authorizationParams: { prompt: 'login' },
    appState: { target: '/' },
  });
}

function handleLogout() {
  logout({
    logoutParams: { returnTo },
  });
}
</script>

<template>
  <nav>
    <button v-if="!isAuthenticated" @click="handleLogin">Log in</button>
    <div v-else>
      <span>{{ user?.email }}</span>
      <button @click="handleLogout">Log out</button>
    </div>
  </nav>

  <!-- DASHBOARD LAYOUT -->
  <section class="dashboard">
    <div class="column">
      <ListDevices />
    </div>

    <div class="column">
      <ListReservations />
    </div>
  </section>
</template>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 1rem;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
