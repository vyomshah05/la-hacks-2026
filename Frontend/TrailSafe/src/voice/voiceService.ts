import * as Speech from 'expo-speech'
import { Audio } from 'expo-av'
import * as FileSystem from 'expo-file-system/legacy'

const ELEVENLABS_KEY = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY ?? ''
const ELEVENLABS_VOICE = process.env.EXPO_PUBLIC_ELEVENLABS_VOICE_ID ?? ''
const VOICE_MOCK = process.env.EXPO_PUBLIC_VOICE_MOCK === 'true'

let _sound: Audio.Sound | null = null

export async function speak(text: string, isOffline: boolean): Promise<void> {
  try {
    if (VOICE_MOCK) {
      console.log('[voice]', text)
      return
    }

    await stopSpeaking()

    if (isOffline || !ELEVENLABS_KEY || !ELEVENLABS_VOICE) {
      _speakOffline(text)
      return
    }

    await _speakElevenLabs(text)
  } catch {
    // voice failure is always silent to the UI
  }
}

export async function stopSpeaking(): Promise<void> {
  try {
    Speech.stop()
    if (_sound) {
      await _sound.unloadAsync()
      _sound = null
    }
  } catch {
    // ignore
  }
}

function _speakOffline(text: string): void {
  Speech.speak(text, { language: 'en-US' })
}

async function _speakElevenLabs(text: string): Promise<void> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10_000)

    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE}`,
      {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'xi-api-key': ELEVENLABS_KEY,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({ text, model_id: 'eleven_turbo_v2_5' }),
      },
    )
    clearTimeout(timeout)

    if (!res.ok) {
      _speakOffline(text)
      return
    }

    const blob = await res.blob()
    const reader = new FileReader()
    const base64: string = await new Promise((resolve, reject) => {
      reader.onload = () => {
        const dataUrl = reader.result as string
        resolve(dataUrl.split(',')[1])
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })

    const uri = FileSystem.cacheDirectory + 'tts_' + Date.now() + '.mp3'
    await FileSystem.writeAsStringAsync(uri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    })

    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true })
    const { sound } = await Audio.Sound.createAsync({ uri })
    _sound = sound
    await sound.playAsync()
  } catch {
    _speakOffline(text)
  }
}
