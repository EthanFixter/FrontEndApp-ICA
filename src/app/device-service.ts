export type Device = {
  readonly id: string; // Unique identifier
  readonly name: string; // Device name (e.g., "iPhone 15 Pro")
  readonly manufacturer: string; // Brand or maker (e.g., "Apple")
  readonly model: string; // Model number or code
};

export type ListDevicesOutput = {
  readonly devices: readonly Device[];
  readonly totalCount: number;
};

export type AddDeviceInput = {
  readonly name: string;
  readonly manufacturer: string;
  readonly model: string;
};

export type AddDeviceOutput = {
  readonly device: Device;
};

export interface DeviceService {
  listDevices(): Promise<ListDevicesOutput>;
  addDevice(input: AddDeviceInput): Promise<AddDeviceOutput>;
}
