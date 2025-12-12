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
      <div class="card__meta">
        <span class="manufacturer">{{ props.device.manufacturer }}</span>
        <span class="model">{{ props.device.model }}</span>
      </div>
    </header>
    <footer class="card__footer">
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
.card__meta {
  font-size: 0.9rem;
  color: #6b7280; /* gray-500 */
}
.card__footer {
  display: flex;
  gap: 0.75rem;
  color: #6b7280; /* gray-500 */
  font-size: 0.85rem;
}
.card__id {
  margin-left: auto;
}
</style>
