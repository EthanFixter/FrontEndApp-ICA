<script setup lang="ts">
import type { Device } from '@/app/device-service';

const props = defineProps<{
  device: Device;
}>();
</script>

<template>
  <article class="card">
    <header class="card__header">
      <div class="card__title">{{ props.device.name }}</div>
      <p class="card__description">{{ props.device.description }}</p>
    </header>
    <footer class="card__footer">
      <span class="card__quantity"
        >Available: {{ props.device.totalQuantity }}</span
      >
      <span class="card__id">#{{ props.device.id }}</span>
    </footer>
  </article>
</template>

<style scoped>
.card {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}
.card__header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}
.card__title {
  font-weight: 600;
  font-size: 1.05rem;
}
.card__description {
  font-size: 0.9rem;
  color: #374151; /* gray-700 */
}
.card__footer {
  display: flex;
  gap: 0.75rem;
  color: #6b7280; /* gray-500 */
  font-size: 0.85rem;
}
.card__quantity {
  font-weight: 500;
}
.card__id {
  margin-left: auto;
}
</style>
