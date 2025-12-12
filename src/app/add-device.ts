import type { DeviceService, AddDeviceInput, Device } from './device-service';

export type AddDeviceResult =
  | { success: true; device: Device }
  | { success: false; errors: readonly string[] };

// Command used by the application layer (decoupled from service DTOs)
export type AddDeviceCommand = {
  readonly name: string;
  readonly manufacturer: string;
  readonly model: string;
};

export type AddDeviceUseCase = (
  service: DeviceService,
  command: AddDeviceCommand,
) => Promise<AddDeviceResult>;

export const addDevice: AddDeviceUseCase = async (service, command) => {
  try {
    // Map command -> service input explicitly, keeping layers decoupled
    const input: AddDeviceInput = {
      name: command.name,
      manufacturer: command.manufacturer,
      model: command.model,
    };
    const { device } = await service.addDevice(input);
    return { success: true, device };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, errors: [message] };
  }
};
