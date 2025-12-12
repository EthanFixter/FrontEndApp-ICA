import type { DeviceService } from '../app/device-service';
import { listDevices } from '../app/list-devices';
import type { ListDevicesResult } from '../app/list-devices';
import { addDevice } from '../app/add-device';
import type { AddDeviceCommand, AddDeviceResult } from '../app/add-device';
import { FakeDeviceService } from '../infra/fake-device-service';
import { HttpDeviceService } from '../infra/http-device-service';
import { seedDevices } from '../seed/devices';

// Lazy singleton for the app's DeviceService implementation.
let _deviceService: DeviceService | undefined;

// Resolve which implementation to use based on env.
// - VITE_DEVICES_SERVICE: 'fake' | 'http' (optional)
// - VITE_DEVICES_BASE_URL: string (optional)
// - VITE_USE_SEED_DATA: 'true' | 'false' (optional, defaults to false)
function createDeviceServiceFromEnv(): DeviceService {
  const env = import.meta.env as Record<string, string | undefined>;
  const kind = (env.VITE_DEVICES_SERVICE || '').toLowerCase();
  const baseUrl = env.VITE_DEVICES_BASE_URL;
  const useSeedData = env.VITE_USE_SEED_DATA === 'true';

  if (kind === 'fake') {
    return new FakeDeviceService(useSeedData ? seedDevices : []);
  }
  if (kind === 'http') return new HttpDeviceService({ baseUrl });

  // Auto-detect: if a base URL is provided, prefer HTTP; otherwise use fake.
  if (baseUrl) return new HttpDeviceService({ baseUrl });
  return new FakeDeviceService(useSeedData ? seedDevices : []);
}

export function getDeviceService(): DeviceService {
  if (!_deviceService) {
    _deviceService = createDeviceServiceFromEnv();
  }
  return _deviceService;
}

// Optional: allow overriding in tests or specialized bootstraps
export function setDeviceService(service: DeviceService): void {
  _deviceService = service;
}

// Factories that return use case functions bound to the resolved service
export function makeListDevices(): () => Promise<ListDevicesResult> {
  const service = getDeviceService();
  return () => listDevices(service);
}

export function makeAddDevice(): (
  command: AddDeviceCommand,
) => Promise<AddDeviceResult> {
  const service = getDeviceService();
  return (command: AddDeviceCommand) => addDevice(service, command);
}

// Public contract returned by buildDeviceUses
export type Devices = {
  listDevices: () => Promise<ListDevicesResult>;
  addDevice: (command: AddDeviceCommand) => Promise<AddDeviceResult>;
};

// Compound factory returning both bound use case functions
export function buildDeviceUses(): Devices {
  return {
    listDevices: makeListDevices(),
    addDevice: makeAddDevice(),
  };
}

// Centralized DI key used by provider and composable
export const DEVICES_KEY = 'Devices' as const;
