// src/shared/types.ts — the contract every agent codes against
export type GPSPosition = {
  lat: number
  lon: number
  heading: number      // degrees 0-360
  accuracy: number     // meters
  timestamp: number
}

export type AppState = {
  position: GPSPosition | null
  destination: GPSPosition | null
  isOffline: boolean
  isStationary: boolean  // true if no movement for 30min
  batteryLevel: number
}

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string
  timestamp: number
}

export type SOSPayload = {
  position: GPSPosition
  locationHistory: GPSPosition[]
  batteryLevel: number
  timestamp: number
  userId?: string
}