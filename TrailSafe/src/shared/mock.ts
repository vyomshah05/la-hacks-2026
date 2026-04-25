import type { GPSPosition } from './types'

// src/shared/mocks.ts
export const MOCK_POSITION: GPSPosition = {
  lat: 34.0522, lon: -118.2437,
  heading: 45, accuracy: 5, timestamp: Date.now()
}
export const MOCK_DESTINATION: GPSPosition = {
  lat: 34.0622, lon: -118.2537,
  heading: 0, accuracy: 0, timestamp: 0
}