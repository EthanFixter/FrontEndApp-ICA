<script setup lang="ts">
import type { Device } from '@/app/device-service';

const props = defineProps<{
  device: Device;
  showDetails: boolean;
}>();
</script>

<template>
  <article class="card">
    <header class="card__header">
      <div class="card__title">{{ props.device.name }}</div>
      <p v-if="props.showDetails" class="card__description">
        {{ props.device.description }}
      </p>
    </header>
    <footer v-if="props.showDetails" class="card__footer">
      <span class="card__quantity"
        >Available: {{ props.device.totalQuantity }}</span
      >
      <span class="card__id">#{{ props.device.id }}</span>
    </footer>
  </article>
</template>
