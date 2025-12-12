import type { DeviceService, Device } from './device-service';

/**
 * Use case: List devices.
 *
 * Contract
 * - Input: a DeviceService instance (injected)
 * - Output: ListDevicesResult
 * - Errors: Caught exceptions are converted to a result with errors and empty devices
 */
export type ListDevicesResult =
  | { success: true; devices: readonly Device[]; totalCount: number }
  | { success: false; errors: readonly string[] };

export type ListDevicesUseCase = (
  service: DeviceService,
) => Promise<ListDevicesResult>;

/**
 * Lists devices using the provided DeviceService.
 *
 * Normalizes the response so callers can safely iterate over `devices`
 * without null checks (defaults to []).
 */
export const listDevices: ListDevicesUseCase = async (service) => {
  try {
    const { devices, totalCount } = await service.listDevices();
    return { success: true, devices, totalCount };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, errors: [message] };
  }
};
