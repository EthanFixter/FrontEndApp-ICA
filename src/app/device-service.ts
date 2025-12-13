export type Device = {
  readonly id: string; // Unique identifier
  readonly name: string; // Device name (e.g., "iPad")
  readonly description: string; // Description of the device
  readonly totalQuantity: number; // Inventory count
};

export type ListDevicesOutput = {
  readonly devices: readonly Device[];
  readonly totalCount: number;
};

export type AddDeviceInput = {
  readonly name: string;
  readonly description: string;
  readonly totalQuantity: number;
};

export type AddDeviceOutput = {
  readonly device: Device;
};

export interface DeviceService {
  listDevices(): Promise<ListDevicesOutput>;
  addDevice(input: AddDeviceInput): Promise<AddDeviceOutput>;
}
