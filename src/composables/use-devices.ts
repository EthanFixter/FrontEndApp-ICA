import { inject, ref, type Ref } from 'vue';
import { DEVICES_KEY, type Devices } from '../config/appServices';
import type { Device } from '../app/device-service';
import type { AddDeviceCommand } from '../app/add-device';
import { appConfig } from '@/config/appConfig';
import { useAuth0 } from '@auth0/auth0-vue';

export type UseDevices = {
  // state
  readonly devices: Ref<readonly Device[]>;
  readonly totalCount: Ref<number>;
  readonly loading: Ref<boolean>;
  readonly adding: Ref<boolean>;
  readonly error: Ref<string | null>;
  // actions
  fetchDevices: () => Promise<void>;
  addDevice: (command: AddDeviceCommand) => Promise<void>;
};

const API_BASE = appConfig.apiBaseUrl;

export function useDevices(): UseDevices {
  const uses = inject<Devices>(DEVICES_KEY);
  if (!uses) throw new Error('Devices not provided');

  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const devices = ref<readonly Device[]>([]);
  const totalCount = ref(0);
  const loading = ref(false);
  const adding = ref(false);
  const error = ref<string | null>(null);

  const fetchDevices = async (): Promise<void> => {
    if (loading.value) return;
    loading.value = true;
    error.value = null;
    try {
      const url = new URL('api/devices', API_BASE).toString();
      const headers: Record<string, string> = { Accept: 'application/json' };

      if (isAuthenticated.value) {
        try {
          const token = await getAccessTokenSilently();
          if (token) headers.Authorization = `Bearer ${token}`;
        } catch {
          // If token retrieval fails, proceed unauthenticated
        }
      }

      const res = await fetch(url, { headers });
      if (!res.ok) {
        throw new Error(
          `Failed to fetch devices: ${res.status} ${res.statusText}`,
        );
      }

      const data = await res.json();
      console.log('Fetched devices raw:', data);

      // Handle both array and object response shapes
      if (Array.isArray(data)) {
        devices.value = data;
        totalCount.value = data.length;
      } else if (Array.isArray(data.devices)) {
        devices.value = data.devices;
        totalCount.value = data.totalCount ?? data.devices.length;
      } else {
        devices.value = [];
        totalCount.value = 0;
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
      devices.value = [];
      totalCount.value = 0;
    } finally {
      loading.value = false;
    }
  };

  const add = async (command: AddDeviceCommand): Promise<void> => {
    if (adding.value) return;
    adding.value = true;
    error.value = null;
    try {
      const result = await uses.addDevice(command);
      if (result.success) {
        // Prepend the new device for a "newest first" UI; keep immutable array for safety
        devices.value = [result.device, ...devices.value];
        totalCount.value = Math.max(totalCount.value + 1, devices.value.length);
      } else {
        error.value = result.errors.join('; ');
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
    } finally {
      adding.value = false;
    }
  };

  return {
    devices,
    totalCount,
    loading,
    adding,
    error,
    fetchDevices,
    addDevice: add,
  };
}
