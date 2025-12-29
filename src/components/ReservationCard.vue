<script setup lang="ts">
import type { Reservation } from '../app/reservation-service';

defineProps<{
  reservation: Reservation;
  showDetails: boolean;
}>();

function formatDate(date: string | undefined): string {
  if (!date) return '';
  return new Date(date).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
</script>

<template>
  <div class="reservation-card">
    <h3>{{ reservation.name }}</h3>

    <div v-if="showDetails">
      <p>{{ reservation.description }}</p>
      <p>Party Size: {{ reservation.partySize }}</p>
      <p>Reserved At: {{ formatDate(reservation.reservedAt.toISOString()) }}</p>
      <p v-if="reservation.returnedAt">
        Returned At: {{ formatDate(reservation.returnedAt.toISOString()) }}
      </p>
      <p>ID: {{ reservation.id }}</p>
    </div>
  </div>
</template>

<style scoped>
.reservation-card {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 6px;
  background-color: #f9f9f9;
}
</style>
