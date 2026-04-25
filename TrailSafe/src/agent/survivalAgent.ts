import type { AppState, ChatMessage } from '../shared/types';
import { callCloudModel, CloudModelError } from './cloudModel';
import { callLocalModel, LocalModelError } from './localModel';
import tips from './tips.json';

type Tip = { trigger: string; keywords: string[]; response: string };

const TIPS = tips as Tip[];
const HARDCODED_FALLBACK =
  'Stay calm, stay put, conserve energy, and signal for help.';

function buildPrompt(text: string, appState: AppState): string {
  const loc = appState.position
    ? `${appState.position.lat.toFixed(5)},${appState.position.lon.toFixed(5)}`
    : 'unknown';
  const battery = Math.round(appState.batteryLevel * 100);
  return [
    'You are a wilderness survival assistant. Respond concisely with action-first guidance.',
    `location: ${loc}`,
    `stationary: ${appState.isStationary}`,
    `battery: ${battery}%`,
    `user: ${text}`,
  ].join('\n');
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function fuzzyMatchTip(text: string): string | null {
  const tokens = tokenize(text);
  if (tokens.length === 0) return null;

  let bestScore = 0;
  let bestIdx = -1;

  for (let i = 0; i < TIPS.length; i++) {
    const tip = TIPS[i];
    let score = 0;
    for (const kw of tip.keywords) {
      const k = kw.toLowerCase();
      for (const t of tokens) {
        if (t === k) {
          score += 2;
        } else if (t.includes(k) || k.includes(t)) {
          score += 1;
        }
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }

  return bestIdx >= 0 && bestScore >= 1 ? TIPS[bestIdx].response : null;
}

export async function sendMessage(
  text: string,
  appState: AppState,
  history: ChatMessage[],
): Promise<string> {
  try {
    const prompt = buildPrompt(text, appState);

    if (!appState.isOffline) {
      try {
        return await callCloudModel(prompt, history);
      } catch (e) {
        if (!(e instanceof CloudModelError)) throw e;
      }
    }

    try {
      return await callLocalModel(prompt);
    } catch (e) {
      if (!(e instanceof LocalModelError)) throw e;
    }

    const tip = fuzzyMatchTip(text);
    if (tip) return tip;

    return HARDCODED_FALLBACK;
  } catch {
    return HARDCODED_FALLBACK;
  }
}
