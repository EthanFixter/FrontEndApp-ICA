import type { ReservationService, Reservation } from './reservation-service';

/**
 * Use case: List reservations.
 *
 * Contract
 * - Input: a ReservationService instance (injected)
 * - Output: ListReservationsResult
 * - Errors: Caught exceptions are converted to a result with errors and empty reservations
 */
export type ListReservationsResult =
  | { success: true; reservations: readonly Reservation[]; totalCount: number }
  | { success: false; errors: readonly string[] };

export type ListReservationsUseCase = (
  service: ReservationService,
) => Promise<ListReservationsResult>;

/**
 * Lists reservations using the provided ReservationService.
 *
 * Normalizes the response so callers can safely iterate over `reservations`
 * without null checks (defaults to []).
 */
export const listReservations: ListReservationsUseCase = async (service) => {
  try {
    const { reservations, totalCount } = await service.listReservations();
    return { success: true, reservations, totalCount };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, errors: [message] };
  }
};
