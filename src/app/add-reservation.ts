import type {
  ReservationService,
  AddReservationInput,
  Reservation,
} from './reservation-service';

export type AddReservationResult =
  | { success: true; reservation: Reservation }
  | { success: false; errors: readonly string[] };

// Command used by the application layer (decoupled from service DTOs)
export type AddReservationCommand = {
  readonly name: string;
  readonly description: string;
  readonly partySize: number;
  readonly reservedAt: Date;
};

export type AddReservationUseCase = (
  service: ReservationService,
  command: AddReservationCommand,
) => Promise<AddReservationResult>;

export const addReservation: AddReservationUseCase = async (
  service,
  command,
) => {
  try {
    // Map command -> service input explicitly, keeping layers decoupled
    const input: AddReservationInput = {
      name: command.name,
      description: command.description,
      partySize: command.partySize,
      reservedAt: command.reservedAt,
    };
    const { reservation } = await service.addReservation(input);
    return { success: true, reservation };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, errors: [message] };
  }
};
