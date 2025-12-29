<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Reservation } from '../app/reservation-service';
import { useReservations } from '../composables/use-reservations';
import { HttpReservationService } from '../infra/http-reservation-service';
import ReservationCard from '../components/ReservationCard.vue';
import AddReservationForm from '../components/AddReservationForm.vue';
import type { AddReservationCommand } from '../app/add-reservation';

// Create the service instance (HTTP by default)
const service = new HttpReservationService({
  baseUrl: import.meta.env.VITE_RESERVATIONS_BASE_URL,
});

// Use the composable
const {
  reservations,
  totalCount,
  isLoading,
  isSubmitting,
  error,
  hasReservations,
  load,
  submit,
} = useReservations(service);

// Explicitly type reservations to avoid TS "never" errors
(reservations.value as Reservation[]) = [];

// UI state
const showAddForm = ref(false);

// Load reservations on mount
onMounted(() => {
  load();
});

// Handle form submission
const handleSubmit = async (command: AddReservationCommand) => {
  await submit(command);
  if (!error.value) {
    showAddForm.value = false;
  }
};

// Handle cancel
const handleCancel = () => {
  showAddForm.value = false;
};
</script>

<template>
  <section class="reservations-page">
    <header class="page-header">
      <h1>Reservations</h1>

      <button
        class="btn btn-primary"
        @click="showAddForm = !showAddForm"
        :disabled="isSubmitting"
      >
        {{ showAddForm ? 'Close Form' : 'Add Reservation' }}
      </button>
    </header>

    <!-- Add Reservation Form -->
    <div v-if="showAddForm" class="form-container">
      <AddReservationForm
        :isSubmitting="isSubmitting"
        :error="error"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading">Loading reservations…</div>

    <!-- Error State -->
    <div v-if="error && !isLoading" class="error">
      {{ error }}
    </div>

    <!-- Empty State -->
    <div v-if="!isLoading && !hasReservations" class="empty">
      No reservations found.
    </div>

    <!-- Reservations List -->
    <div v-if="hasReservations" class="reservations-list">
      <ReservationCard
        v-for="r in reservations"
        :key="r.id"
        :reservation="r"
        :showDetails="true"
      />
    </div>

    <!-- Footer -->
    <footer v-if="hasReservations" class="footer">
      Total Reservations: {{ totalCount }}
    </footer>
  </section>
</template>

<style scoped>
.reservations-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-container {
  margin-bottom: 1rem;
}

.reservations-list {
  display: grid;
  gap: 1rem;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 1rem;
  font-size: 1.1rem;
}
</style>
