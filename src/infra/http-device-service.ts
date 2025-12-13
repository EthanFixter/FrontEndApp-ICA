import type {
  Device,
  DeviceService,
  AddDeviceInput,
  AddDeviceOutput,
  ListDevicesOutput,
} from '../app/device-service';

type DeviceDto = {
  id: string;
  name: string;
  description: string;
  totalQuantity: number;
};

type ListDevicesResponseDto =
  | { devices?: DeviceDto[]; totalCount?: number; errors?: string[] }
  | DeviceDto[];

type AddDeviceResponseDto = { device?: DeviceDto; errors?: string[] };

export type HttpClient = typeof fetch;

export type HttpDeviceServiceOptions = {
  readonly baseUrl?: string;
  readonly http?: HttpClient;
  readonly headers?: Record<string, string>;
};

export class HttpDeviceService implements DeviceService {
  private readonly baseUrl?: string;
  private readonly http: HttpClient;
  private readonly headers: Record<string, string>;

  constructor(options: HttpDeviceServiceOptions = {}) {
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

  async listDevices(): Promise<ListDevicesOutput> {
    const res = await this.http(this.url('/devices'), {
      method: 'GET',
      headers: this.mergeHeaders({ Accept: 'application/json' }),
    });
    await this.ensureOk(res);
    const body = (await this.parseJson(res)) as ListDevicesResponseDto;

    const errors = Array.isArray(body)
      ? undefined
      : Array.isArray(body.errors)
        ? body.errors
        : undefined;
    if (errors && errors.length) throw new Error(errors.join('; '));

    const devices = Array.isArray(body)
      ? body
      : Array.isArray(body.devices)
        ? body.devices
        : [];
    const mapped = devices.map(toDomainDevice);
    const totalCount = Array.isArray(body)
      ? mapped.length
      : typeof body.totalCount === 'number'
        ? body.totalCount
        : mapped.length;
    return { devices: mapped, totalCount };
  }

  async addDevice(input: AddDeviceInput): Promise<AddDeviceOutput> {
    const dto = toAddDeviceRequestDto(input);
    const res = await this.http(this.url('/devices'), {
      method: 'POST',
      headers: this.mergeHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(dto),
    });
    await this.ensureOk(res);
    const body = (await this.parseJson(res)) as AddDeviceResponseDto;
    if (Array.isArray(body.errors) && body.errors.length) {
      throw new Error(body.errors.join('; '));
    }
    const deviceDto = body.device;
    if (!deviceDto || typeof deviceDto !== 'object') {
      throw new Error('Malformed add device response');
    }
    const device = toDomainDevice(deviceDto);
    return { device };
  }

  // helpers
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

// Infra-level request DTO (decoupled from app AddDeviceInput)
type AddDeviceRequestDto = {
  name: string;
  description: string;
  totalQuantity: number;
};

function toAddDeviceRequestDto(input: AddDeviceInput): AddDeviceRequestDto {
  return {
    name: input.name,
    description: input.description,
    totalQuantity: input.totalQuantity,
  };
}

function toDomainDevice(d: DeviceDto): Device {
  return {
    id: d.id,
    name: d.name,
    description: d.description,
    totalQuantity: d.totalQuantity,
  };
}
