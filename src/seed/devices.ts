import type { Device } from '../app/device-service';

export const seedDevices: Device[] = [
  {
    id: 'd_1',
    name: 'iPhone 15 Pro',
    description: 'Apple flagship phone with A17 chip',
    totalQuantity: 25,
  },
  {
    id: 'd_2',
    name: 'Galaxy S24 Ultra',
    description: 'Samsung high-end smartphone with advanced camera',
    totalQuantity: 40,
  },
  {
    id: 'd_3',
    name: 'Pixel 9',
    description: 'Google phone with AI-powered features',
    totalQuantity: 15,
  },
];
