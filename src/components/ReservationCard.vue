<script setup lang="ts">
import type { Reservation } from '@/app/reservation-service';

const props = defineProps<{
  reservation: Reservation;
  showDetails: boolean;
}>();
</script>

<template>
  <article class="card">
    <header class="card__header">
      <div class="card__title">{{ props.reservation.name }}</div>

      <p v-if="props.showDetails" class="card__description">
        {{ props.reservation.description }}
      </p>
    </header>

    <footer v-if="props.showDetails" class="card__footer">
      <span class="card__quantity">
        Party Size: {{ props.reservation.partySize }}
      </span>

      <span class="card__date">
        Reserved At:
        {{ new Date(props.reservation.reservedAt).toLocaleString() }}
      </span>

      <span v-if="props.reservation.returnedAt" class="card__date">
        Returned At:
        {{ new Date(props.reservation.returnedAt).toLocaleString() }}
      </span>

      <span class="card__id">#{{ props.reservation.id }}</span>
    </footer>
  </article>
</template>
