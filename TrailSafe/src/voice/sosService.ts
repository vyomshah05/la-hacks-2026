import AsyncStorage from '@react-native-async-storage/async-storage'
import type { SOSPayload } from '../shared/types'

// TODO: fill in from https://developer.worldcoin.org once registered
const WORLD_APP_ID = process.env.EXPO_PUBLIC_WORLD_APP_ID ?? ''
const WORLD_ACTION = process.env.EXPO_PUBLIC_WORLD_ACTION ?? 'trailsafe-sos'
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL ?? ''
const MOCK_SOS = process.env.EXPO_PUBLIC_MOCK_SOS === 'true'

const KEY_LAST = '@trailsafe/sos/last'
const KEY_QUEUE = '@trailsafe/sos/queue'

export async function verifyHumanWithWorldID(): Promise<boolean> {
  if (__DEV__) return true

  try {
    // MiniKit is a webview-only package; may not function in Expo Go
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const minikit: any = await import('@worldcoin/minikit-js')
    const MiniKit = minikit.MiniKit
    const VerificationLevel = minikit.VerificationLevel

    if (!MiniKit.isInstalled()) {
      console.warn('[sos] MiniKit not installed — bypassing World ID check')
      return true
    }

    const { finalPayload } = await MiniKit.commandsAsync.verify({
      action: WORLD_ACTION,
      app_id: WORLD_APP_ID as `app_${string}`,
      verification_level: VerificationLevel.Orb,
    })

    return finalPayload.status === 'success'
  } catch (err) {
    console.warn('[sos] World ID verification failed, allowing SOS:', err)
    return true
  }
}

export async function triggerSOS(payload: SOSPayload): Promise<void> {
  if (MOCK_SOS) {
    console.log('[sos] mock — would send payload:', JSON.stringify(payload))
    return
  }

  // persist immediately so it survives a crash
  await AsyncStorage.setItem(KEY_LAST, JSON.stringify(payload))

  const verified = await verifyHumanWithWorldID()
  if (!verified) return

  await _postSOS(payload)
}

export async function retryPendingSOS(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(KEY_QUEUE)
    if (!raw) return

    const queue: SOSPayload[] = JSON.parse(raw)
    const remaining: SOSPayload[] = []

    for (const payload of queue) {
      const ok = await _postSOS(payload, false)
      if (!ok) remaining.push(payload)
    }

    if (remaining.length === 0) {
      await AsyncStorage.removeItem(KEY_QUEUE)
    } else {
      await AsyncStorage.setItem(KEY_QUEUE, JSON.stringify(remaining))
    }
  } catch (err) {
    console.warn('[sos] retryPendingSOS error:', err)
  }
}

async function _postSOS(payload: SOSPayload, enqueueOnFail = true): Promise<boolean> {
  if (!BACKEND_URL) {
    console.warn('[sos] EXPO_PUBLIC_BACKEND_URL not set — skipping POST')
    return false
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10_000)

    const res = await fetch(`${BACKEND_URL}/sos`, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    clearTimeout(timeout)

    if (res.ok) return true

    console.warn('[sos] POST returned', res.status)
  } catch (err) {
    console.warn('[sos] POST failed:', err)
  }

  if (enqueueOnFail) await _enqueue(payload)
  return false
}

async function _enqueue(payload: SOSPayload): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(KEY_QUEUE)
    const queue: SOSPayload[] = raw ? JSON.parse(raw) : []
    queue.push(payload)
    await AsyncStorage.setItem(KEY_QUEUE, JSON.stringify(queue))
  } catch (err) {
    console.warn('[sos] enqueue error:', err)
  }
}
