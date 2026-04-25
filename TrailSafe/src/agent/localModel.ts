export class LocalModelError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LocalModelError';
  }
}

const LOCAL_URL = 'http://localhost:8080/generate';
const TIMEOUT_MS = 10_000;
const ARTIFACT_REGEX = /<\|[^|>]+\|>|<\/?s>|\[\/?INST\]/g;

let healthChecked = false;
let healthy = false;

async function checkHealthOnce(): Promise<void> {
  if (healthChecked) return;
  healthChecked = true;
  try {
    const mod: { testLocalModel?: () => Promise<boolean> } =
      // @ts-ignore — module may not exist yet (ZETIC agent ships separately)
      require('../zetic/modelConfig');
    if (typeof mod.testLocalModel !== 'function') {
      healthy = false;
      return;
    }
    healthy = await mod.testLocalModel();
  } catch {
    healthy = false;
  }
}

export async function callLocalModel(prompt: string): Promise<string> {
  await checkHealthOnce();
  if (!healthy) {
    throw new LocalModelError('local server unavailable');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(LOCAL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, max_tokens: 200 }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new LocalModelError(`local model HTTP ${res.status}`);
    }

    const data = (await res.json()) as { text?: string; output?: string; response?: string };
    const raw = data.text ?? data.output ?? data.response ?? '';
    if (!raw) {
      throw new LocalModelError('local model returned empty response');
    }

    return raw.replace(ARTIFACT_REGEX, '').trim();
  } catch (err) {
    if (err instanceof LocalModelError) throw err;
    throw new LocalModelError(
      err instanceof Error ? `local model: ${err.message}` : 'local model failed',
    );
  } finally {
    clearTimeout(timer);
  }
}
