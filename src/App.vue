<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';

const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
const returnTo = typeof window !== 'undefined' ? window.location.origin : '/';

function handleLogin() {
  loginWithRedirect({
    authorizationParams: { prompt: 'login' },
    appState: { target: '/devices' }, // optional redirect target
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

  <!-- This is where ListDevices.vue will render -->
  <router-view />
</template>
