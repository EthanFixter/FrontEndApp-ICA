// Domain model
export type Reservation = {
  readonly id: string; // unique identifier
  readonly name: string; // reservation name/title
  readonly description: string; // details about the reservation
  readonly partySize: number; // number of people/items reserved
  readonly reservedAt: Date; // when the reservation was made
  readonly returnedAt?: Date; // optional return timestamp
};

// Output for listing reservations
export type ListReservationsOutput = {
  readonly reservations: readonly Reservation[];
  readonly totalCount: number;
};

// Input for adding a reservation
export type AddReservationInput = {
  readonly name: string;
  readonly description: string;
  readonly partySize: number;
  readonly reservedAt: Date;
};

// Output for adding a reservation
export type AddReservationOutput = {
  readonly reservation: Reservation;
};

// Service interface (mirrors DeviceService)
export interface ReservationService {
  listReservations(): Promise<ListReservationsOutput>;
  addReservation(input: AddReservationInput): Promise<AddReservationOutput>;
}
