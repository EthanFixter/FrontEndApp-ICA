import type {
  Reservation,
  ReservationService,
  AddReservationInput,
  AddReservationOutput,
  ListReservationsOutput,
} from '../app/reservation-service';

export type HttpClient = typeof fetch;

export type HttpReservationServiceOptions = {
  readonly baseUrl?: string;
  readonly http?: HttpClient;
  readonly headers?: Record<string, string>;
};

// --- DTOs ---

type ReservationDto = {
  id: string;
  name: string;
  description: string;
  partySize: number;
  reservedAt: string; // ISO string from backend
  returnedAt?: string; // ISO string or undefined
};

type ListReservationsResponseDto =
  | { reservations?: ReservationDto[]; totalCount?: number; errors?: string[] }
  | ReservationDto[];

type AddReservationResponseDto = {
  reservation?: ReservationDto;
  errors?: string[];
};

// --- Service Implementation ---

export class HttpReservationService implements ReservationService {
  private readonly baseUrl?: string;
  private readonly http: HttpClient;
  private readonly headers: Record<string, string>;

  constructor(options: HttpReservationServiceOptions = {}) {
    this.baseUrl = options.baseUrl
      ? options.baseUrl.replace(/\/$/, '')
      : undefined;

    const rawHttp: HttpClient | undefined =
      options.http ?? (typeof fetch !== 'undefined' ? fetch : undefined);

    if (!rawHttp) {
      throw new Error('No fetch implementation available');
    }

    const target: any = typeof window !== 'undefined' ? window : globalThis;
    this.http = (rawHttp as any).bind(target);
    this.headers = { ...(options.headers ?? {}) };
  }

  // --- LIST RESERVATIONS ---
  async listReservations(): Promise<ListReservationsOutput> {
    const res = await this.http(this.url('/reservations'), {
      method: 'GET',
      headers: this.mergeHeaders({ Accept: 'application/json' }),
    });

    await this.ensureOk(res);
    const body = (await this.parseJson(res)) as ListReservationsResponseDto;

    const errors = Array.isArray(body)
      ? undefined
      : Array.isArray(body.errors)
        ? body.errors
        : undefined;

    if (errors && errors.length) throw new Error(errors.join('; '));

    const reservations = Array.isArray(body)
      ? body
      : Array.isArray(body.reservations)
        ? body.reservations
        : [];

    const mapped = reservations.map(toDomainReservation);

    const totalCount = Array.isArray(body)
      ? mapped.length
      : typeof body.totalCount === 'number'
        ? body.totalCount
        : mapped.length;

    return { reservations: mapped, totalCount };
  }

  // --- ADD RESERVATION ---
  async addReservation(
    input: AddReservationInput,
  ): Promise<AddReservationOutput> {
    const dto = toAddReservationRequestDto(input);

    const res = await this.http(this.url('/reservations'), {
      method: 'POST',
      headers: this.mergeHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(dto),
    });

    await this.ensureOk(res);
    const body = (await this.parseJson(res)) as AddReservationResponseDto;

    if (Array.isArray(body.errors) && body.errors.length) {
      throw new Error(body.errors.join('; '));
    }

    const reservationDto = body.reservation;
    if (!reservationDto || typeof reservationDto !== 'object') {
      throw new Error('Malformed add reservation response');
    }

    const reservation = toDomainReservation(reservationDto);
    return { reservation };
  }

  // --- Helpers ---
  private url(path: string): string {
    if (!this.baseUrl) return path;
    return `${this.baseUrl}${path}`;
  }

  private mergeHeaders(extra: Record<string, string>): Record<string, string> {
    return { ...this.headers, ...extra };
  }

  private async ensureOk(res: Response): Promise<void> {
    if (res.ok) return;

    let message = `${res.status} ${res.statusText}`;

    try {
      const contentType = res.headers.get('content-type') ?? '';
      if (contentType.includes('application/json')) {
        const errBody = await res.clone().json();
        const msg = (errBody && (errBody.message || errBody.error)) as
          | string
          | undefined;
        if (msg) message = `${message} - ${msg}`;
      } else {
        const text = await res.clone().text();
        if (text) message = `${message} - ${text.slice(0, 300)}`;
      }
    } catch {
      // ignore parse errors
    }

    throw new Error(message);
  }

  private async parseJson(res: Response): Promise<unknown> {
    const text = await res.text();
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch {
      throw new Error('Invalid JSON response');
    }
  }
}

// --- Infra-level request DTO ---
type AddReservationRequestDto = {
  name: string;
  description: string;
  partySize: number;
  reservedAt: string; // ISO string
};

function toAddReservationRequestDto(
  input: AddReservationInput,
): AddReservationRequestDto {
  return {
    name: input.name,
    description: input.description,
    partySize: input.partySize,
    reservedAt: input.reservedAt.toISOString(),
  };
}
// --- Mapping DTO -> Domain ---
function toDomainReservation(d: ReservationDto): Reservation {
  return {
    id: d.id,
    name: d.name,
    description: d.description,
    partySize: d.partySize,
    reservedAt: new Date(d.reservedAt),
    returnedAt: d.returnedAt ? new Date(d.returnedAt) : undefined,
  };
}
