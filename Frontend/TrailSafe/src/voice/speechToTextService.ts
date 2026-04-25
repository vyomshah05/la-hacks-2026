import { Audio } from 'expo-av'

const ELEVENLABS_KEY = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY ?? ''

let _recording: Audio.Recording | null = null

export async function startRecording(): Promise<void> {
  const { granted } = await Audio.requestPermissionsAsync()
  if (!granted) throw new Error('Microphone permission denied')

  await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true })

  const { recording } = await Audio.Recording.createAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY,
  )
  _recording = recording
}

export async function stopRecordingAndTranscribe(isOffline: boolean): Promise<string | null> {
  if (!_recording) return null

  try {
    // getURI must be called before stopAndUnloadAsync
    const uri = _recording.getURI()
    await _recording.stopAndUnloadAsync()
    _recording = null

    await Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true })

    if (!uri) { console.warn('[stt] no URI after recording'); return null }
    if (isOffline) { console.warn('[stt] offline — skipping transcription'); return null }
    if (!ELEVENLABS_KEY) { console.warn('[stt] EXPO_PUBLIC_ELEVENLABS_API_KEY not set'); return null }

    console.log('[stt] uploading', uri)

    const formData = new FormData()
    formData.append('file', { uri, type: 'audio/m4a', name: 'voice.m4a' } as unknown as Blob)
    formData.append('model_id', 'scribe_v1')

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30_000)

    const res = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      signal: controller.signal,
      headers: { 'xi-api-key': ELEVENLABS_KEY },
      body: formData,
    })
    clearTimeout(timeout)

    if (!res.ok) {
      const errText = await res.text().catch(() => '(no body)')
      console.warn('[stt] ElevenLabs error', res.status, errText)
      return null
    }

    const json = await res.json()
    console.log('[stt] transcript:', json.text)
    return (json.text as string)?.trim() ?? null
  } catch (err) {
    console.warn('[stt] unexpected error:', err)
    return null
  } finally {
    _recording = null
  }
}

export function isCurrentlyRecording(): boolean {
  return _recording !== null
}
