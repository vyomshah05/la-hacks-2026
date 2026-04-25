import type { ChatMessage } from '../shared/types';

export class CloudModelError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CloudModelError';
  }
}

const TIMEOUT_MS = 8_000;
const HISTORY_CAP = 10;

export async function callCloudModel(
  prompt: string,
  history: ChatMessage[],
): Promise<string> {
  const base = process.env.EXPO_PUBLIC_BACKEND_URL;
  if (!base) {
    throw new CloudModelError('no backend configured');
  }

  const trimmed = history.slice(-HISTORY_CAP).map((m) => ({
    role: m.role,
    content: m.text,
  }));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${base.replace(/\/$/, '')}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, history: trimmed }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new CloudModelError(`cloud HTTP ${res.status}`);
    }

    const data = (await res.json()) as { reply?: string };
    if (!data.reply) {
      throw new CloudModelError('cloud returned empty reply');
    }

    return data.reply;
  } catch (err) {
    if (err instanceof CloudModelError) throw err;
    throw new CloudModelError(
      err instanceof Error ? `cloud: ${err.message}` : 'cloud request failed',
    );
  } finally {
    clearTimeout(timer);
  }
}
