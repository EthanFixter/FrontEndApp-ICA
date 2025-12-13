import type {
  Device,
  DeviceService,
  AddDeviceInput,
  AddDeviceOutput,
  ListDevicesOutput,
} from '../app/device-service';

/**
 * A simple in-memory implementation of DeviceService for development/testing.
 */
export class FakeDeviceService implements DeviceService {
  private items: Device[];
  private idCounter: number;

  constructor(initial: ReadonlyArray<Device> = []) {
    this.items = [...initial];
    this.idCounter = initial.length;
  }

  async listDevices(): Promise<ListDevicesOutput> {
    // Return a shallow copy to avoid external mutation
    return {
      devices: [...this.items],
      totalCount: this.items.length,
    };
  }

  async addDevice(input: AddDeviceInput): Promise<AddDeviceOutput> {
    const device: Device = {
      id: this.nextId(),
      name: input.name,
      description: input.description,
      totalQuantity: input.totalQuantity,
    };
    // Newest first
    this.items.unshift(device);
    return { device };
  }

  private nextId(): string {
    this.idCounter += 1;
    return `d_${this.idCounter}`;
  }
}
