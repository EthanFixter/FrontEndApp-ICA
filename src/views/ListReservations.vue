<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import type { Reservation } from '../app/reservation-service';
import { useReservations } from '../composables/use-reservations';
import { HttpReservationService } from '../infra/http-reservation-service';
import type { AddReservationCommand } from '../app/add-reservation';
import ReservationCard from '../components/ReservationCard.vue';
import AddReservationForm from '../components/AddReservationForm.vue';

const { isAuthenticated } = useAuth0();

const service = new HttpReservationService({
  baseUrl: import.meta.env.VITE_RESERVATIONS_BASE_URL,
});

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

const showAddForm = ref(false);

onMounted(() => {
  load();
});

const handleSubmit = async (command: AddReservationCommand) => {
  await submit(command);
  if (!error.value) {
    showAddForm.value = false;
  }
};

const handleCancel = () => {
  showAddForm.value = false;
};
</script>

<template>
  <section class="reservations-page">
    <header class="page-header">
      <h2>Reservations</h2>

      <!-- 🔒 Only show when logged in -->
      <button
        v-if="isAuthenticated"
        class="btn btn-primary"
        @click="showAddForm = !showAddForm"
        :disabled="isSubmitting"
      >
        {{ showAddForm ? 'Close Form' : 'Add Reservation' }}
      </button>
    </header>

    <!-- 🔒 Only show form when logged in -->
    <div v-if="showAddForm && isAuthenticated" class="form-container">
      <AddReservationForm
        :isSubmitting="isSubmitting"
        :error="error"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>

    <div v-if="isLoading" class="loading">Loading reservations…</div>
    <div v-if="error && !isLoading" class="error">{{ error }}</div>
    <div v-if="!isLoading && !hasReservations" class="empty">
      No reservations found.
    </div>

    <div v-if="hasReservations" class="reservations-list">
      <ReservationCard
        v-for="r in reservations"
        :key="r.id"
        :reservation="r"
        :showDetails="isAuthenticated"
      />
    </div>

    <footer v-if="hasReservations" class="footer">
      Total Reservations: {{ totalCount }}
    </footer>
  </section>
</template>
