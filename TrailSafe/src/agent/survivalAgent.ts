// Stub — replace with real AI Brain implementation.
// Expected by SurvivalChat: sendMessage(text, appState, history) => Promise<string>
import type { AppState, ChatMessage } from '../shared/types'

export async function sendMessage(
  userText: string,
  _appState: AppState,
  _history: ChatMessage[],
): Promise<string> {
  await new Promise((r) => setTimeout(r, 800))
  return `[Stub] Got: "${userText}" — wire up the AI Brain agent to replace this.`
}
