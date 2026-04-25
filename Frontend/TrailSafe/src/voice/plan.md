# Voice Integration Plan — New Frontend (`Frontend/TrailSafe/`)

## Context

The repo currently has a working speech stack at `TrailSafe/src/voice/`:
- `voiceService.ts` — TTS (ElevenLabs `eleven_turbo_v2_5` with `expo-speech` offline fallback).
- `speechToTextService.ts` — STT (record with `expo-av`, transcribe with ElevenLabs `scribe_v1`).
- `sosService.ts` — POSTs `SOSPayload` to `${EXPO_PUBLIC_BACKEND_URL}/sos`, persists last payload, retries failures from an AsyncStorage queue, gates with World ID.
- `SurvivalChat.tsx` — one component orchestrating chat + mic + SOS.

A new Expo Router frontend at `Frontend/TrailSafe/` already has:
- A chat-shaped `AIGuideScreen` with text input + suggestion pills (no voice yet).
- An `SOSScreen` with a placeholder mic button + `isListening` state.
- A theme + reusable UI primitives (`Card`, `CircleIcon`, `Row`, `text.*`).
- **No** voice/audio/AsyncStorage/MiniKit deps installed and **no** mic permissions in `app.json`.

Goal: move the voice stack into the new frontend, fitting the new screen split (chat in `AIGuideScreen`, SOS in `SOSScreen`), keeping the backend contract identical (still POST `/sos` with the same `SOSPayload`).

User decisions:
- SOS hold-to-trigger lives **only** in `SOSScreen`. `AIGuideScreen` stays pure voice chat.
- `AppState` is **mocked** in screens for now (matches the old `App.tsx`); real GPS/battery wiring is out of scope.

## Plan

### 1. Dependencies & permissions
- Edit `Frontend/TrailSafe/package.json`, add (versions matching the working `TrailSafe/package.json`):
  - `expo-speech ~14.0.8`
  - `expo-av ~16.0.8`
  - `expo-file-system ~19.0.21`
  - `@react-native-async-storage/async-storage 2.2.0`
  - `@worldcoin/minikit-js ^2.0.3`
- Edit `Frontend/TrailSafe/app.json`:
  - Add `expo-av` plugin block with `microphonePermission: "TrailSafe needs your microphone for voice commands and emergency dispatch."`
  - Add `ios.infoPlist.NSMicrophoneUsageDescription`.
  - Add `android.permissions: ["RECORD_AUDIO"]`.

### 2. Port voice services verbatim (logic unchanged, backend contract unchanged)
Copy these three files unmodified into `Frontend/TrailSafe/src/voice/`:
- `voiceService.ts`
- `speechToTextService.ts`
- `sosService.ts`

These are pure utilities with no UI imports — they drop in cleanly. They read the same `EXPO_PUBLIC_*` env vars (see §6).

### 3. Add the AI Brain stub + types
- Create `Frontend/TrailSafe/src/agent/survivalAgent.ts` — same stub: `sendMessage(userText, appState, history): Promise<string>` returning a placeholder reply (so the chat works end-to-end before the brain lands).
- Edit `Frontend/TrailSafe/src/shared/types.ts` — append `ChatMessage` and `SOSPayload` (the file already has `GPSPosition` + `AppState`).

### 4. Wire `AIGuideScreen` for voice chat
File: `Frontend/TrailSafe/src/mobile/screens/AIGuideScreen.tsx`

- Replace the static demo content with live chat state:
  - `messages: ChatMessage[]` rendered as bubbles (extend the existing `ChatBubble` to handle `role: 'user'` right-aligned, using `colors.primary` / `colors.input` from the new theme rather than hard-coded colors).
  - `sending`, `recording`, `transcribing` flags.
- Send flow: push user message → `sendMessage(text, appState, history)` from `survivalAgent.ts` → push assistant reply → `speak(reply, appState.isOffline)`.
- Add a mic button to the existing input row (alongside send): idle = `colors.primary` with `mic` icon, recording = `colors.destructive` with stop icon, transcribing = `<ActivityIndicator />`.
- Mic flow: tap to `startRecording()`, tap again to `stopRecordingAndTranscribe(isOffline)` then auto-send the transcript.
- Keep the suggestion pills — tapping a suggestion routes through the same send flow.
- Use a local `mockAppState` constant at the top of the file (same shape as old `App.tsx`).

### 5. Wire `SOSScreen` for voice + hold-to-SOS
File: `Frontend/TrailSafe/src/mobile/screens/SOSScreen.tsx`

- Reuse the existing big circular mic button: actually toggle `startRecording` / `stopRecordingAndTranscribe`. Show the resulting transcript in the "I'm separated from the group..." slot (lightweight — full LLM dispatch from voice is out of scope).
- Add a full-width red **"HOLD 3s FOR SOS"** button below the existing payload section, ported from the old `SurvivalChat` `Pressable` + `setTimeout(3000)` flow (no `react-native-gesture-handler` needed — the old code intentionally uses `Pressable` for Expo Go compatibility).
- On hold complete → confirmation `Modal` → `triggerSOS(payload)` with payload built from `mockAppState`.
- Visual style: `colors.destructive` for the SOS button, `colors.card` for the modal — match the new theme.

### 6. App lifecycle: retry queued SOS on resume
File: `Frontend/TrailSafe/app/_layout.tsx`
- Add a `useEffect` subscribing to React Native `AppState` ('active') and call `retryPendingSOS()`. Wrap inside the existing `SafeAreaProvider`. (No `GestureHandlerRootView` needed.)

### 7. Env vars (backend stays the same)
- `EXPO_PUBLIC_ELEVENLABS_API_KEY`
- `EXPO_PUBLIC_ELEVENLABS_VOICE_ID`
- `EXPO_PUBLIC_VOICE_MOCK` (dev)
- `EXPO_PUBLIC_BACKEND_URL` (no trailing slash; service appends `/sos`)
- `EXPO_PUBLIC_MOCK_SOS` (dev)
- `EXPO_PUBLIC_MOCK_AGENT` (dev)
- `EXPO_PUBLIC_WORLD_APP_ID`
- `EXPO_PUBLIC_WORLD_ACTION` (default `trailsafe-sos`)

## Critical files

**New**
- `Frontend/TrailSafe/src/voice/plan.md` (this file)
- `Frontend/TrailSafe/src/voice/voiceService.ts` (copy)
- `Frontend/TrailSafe/src/voice/speechToTextService.ts` (copy)
- `Frontend/TrailSafe/src/voice/sosService.ts` (copy)
- `Frontend/TrailSafe/src/agent/survivalAgent.ts` (stub)

**Modified**
- `Frontend/TrailSafe/package.json` (deps)
- `Frontend/TrailSafe/app.json` (mic permissions, expo-av plugin)
- `Frontend/TrailSafe/app/_layout.tsx` (`retryPendingSOS` on resume)
- `Frontend/TrailSafe/src/shared/types.ts` (+`ChatMessage`, `SOSPayload`)
- `Frontend/TrailSafe/src/mobile/screens/AIGuideScreen.tsx` (real chat + mic)
- `Frontend/TrailSafe/src/mobile/screens/SOSScreen.tsx` (mic transcript + hold-3s SOS)

## Reused functions / utilities

- From the ported `voice/` services: `speak`, `stopSpeaking`, `startRecording`, `stopRecordingAndTranscribe`, `isCurrentlyRecording`, `triggerSOS`, `retryPendingSOS`, `verifyHumanWithWorldID`.
- From the new frontend: `Card`, `Row`, `CircleIcon`, `AppButton`, `Screen` (`src/mobile/ui.tsx`, `components/`); `colors`, `text`, `spacing` (`src/mobile/theme.ts`); chat/mic styles in `src/mobile/styles.ts` (`chatContent`, `chatInputBar`, `chatInput`, `sendButton`, `chatBubble`, `chatRow`, `micButton`).
- Stub at `src/agent/survivalAgent.ts` keeps the chat callable until the AI brain lands.

## Backend

Unchanged. The existing `${EXPO_PUBLIC_BACKEND_URL}/sos` POST contract carries over verbatim (`SOSPayload` JSON body, 2xx expected, retry on failure). No backend folder exists in this repo — the contract is fully described by `sosService.ts`. If a real backend service is pointed at later, the URL is set via env without code changes.

## Verification

1. `cd Frontend/TrailSafe && pnpm install` succeeds, lockfile updates.
2. `pnpm exec tsc --noEmit` clean.
3. `pnpm start` (Expo) → open in Expo Go.
4. Set `EXPO_PUBLIC_VOICE_MOCK=true`, `EXPO_PUBLIC_MOCK_SOS=true`, `EXPO_PUBLIC_MOCK_AGENT=true` for a no-keys smoke test.
5. AI Guide screen:
   - Type a message → assistant echo appears → console logs `[voice]` (mock TTS).
   - Tap mic, speak, tap again → transcript becomes a user message → assistant echoes.
6. SOS screen:
   - Tap mic, speak → transcript renders in the example query slot.
   - Hold red SOS button 3s → confirmation modal → confirm → console logs SOS payload (mock mode) or POSTs to `${EXPO_PUBLIC_BACKEND_URL}/sos`.
7. Disable mocks, set real ElevenLabs + backend env vars → repeat 5 + 6 with live audio + a real POST.
8. Background app, foreground it → `retryPendingSOS` runs, AsyncStorage queue drains.
