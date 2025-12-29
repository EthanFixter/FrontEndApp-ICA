import { ref, computed } from 'vue';
import type { ReservationService } from '../reservation-service';
import type { AddReservationCommand } from '../add-reservation';
import { listReservations } from '../list-reservations';
import { addReservation } from '../add-reservation';
import type { Reservation } from '@/app/reservation-service';

export function useReservations(service: ReservationService) {
  const reservations = ref<Reservation[]>([]);
  const totalCount = ref(0);
  const isLoading = ref(false);
  const isSubmitting = ref(false);
  const error = ref<string | null>(null);

  // --- Load all reservations ---
  const load = async () => {
    isLoading.value = true;
    error.value = null;

    const result = await listReservations(service);

    if (result.success) {
      reservations.value = result.reservations;
      totalCount.value = result.totalCount;
    } else {
      error.value = result.errors.join(', ');
    }

    isLoading.value = false;
  };

  // --- Add a reservation ---
  const submit = async (command: AddReservationCommand) => {
    isSubmitting.value = true;
    error.value = null;

    const result = await addReservation(service, command);

    if (result.success) {
      // Prepend newest reservation
      reservations.value.unshift(result.reservation);
      totalCount.value += 1;
    } else {
      error.value = result.errors.join(', ');
    }

    isSubmitting.value = false;
  };

  const hasReservations = computed(() => reservations.value.length > 0);

  return {
    reservations,
    totalCount,
    isLoading,
    isSubmitting,
    error,
    hasReservations,
    load,
    submit,
  };
}
