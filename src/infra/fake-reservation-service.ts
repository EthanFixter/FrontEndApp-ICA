import type {
  Reservation,
  ReservationService,
  AddReservationInput,
  AddReservationOutput,
  ListReservationsOutput,
} from '../app/reservation-service';

/**
 * A simple in-memory implementation of ReservationService for development/testing.
 */
export class FakeReservationService implements ReservationService {
  private items: Reservation[];
  private idCounter: number;

  constructor(initial: ReadonlyArray<Reservation> = []) {
    this.items = [...initial];
    this.idCounter = initial.length;
  }

  async listReservations(): Promise<ListReservationsOutput> {
    return {
      reservations: [...this.items],
      totalCount: this.items.length,
    };
  }

  async addReservation(
    input: AddReservationInput,
  ): Promise<AddReservationOutput> {
    const reservation: Reservation = {
      id: this.nextId(),
      name: input.name,
      description: input.description,
      partySize: input.partySize,
      reservedAt: input.reservedAt,
      returnedAt: undefined, // new reservations are not returned yet
    };

    // Newest first
    this.items.unshift(reservation);

    return { reservation };
  }

  private nextId(): string {
    this.idCounter += 1;
    return `r_${this.idCounter}`;
  }
}
