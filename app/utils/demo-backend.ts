import { handleMockRequest, type MockRequest } from "#shared/mock/handlers";
import { createMockState, type MockState } from "#shared/mock/state";

/**
 * Runs the mock backend inside the browser.
 *
 * Only used by the static GitHub Pages build, where there is no server to talk to.
 * It calls exactly the same handlers Nitro does, so behaviour cannot drift.
 */

const STATE_KEY = "iz.demo.state.v1";
const SESSION_KEY = "iz.demo.session.v1";

let state: MockState | undefined;

function loadState(): MockState {
  if (state) return state;

  if (import.meta.client) {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (raw) {
        state = JSON.parse(raw) as MockState;
        return state;
      }
    } catch {
      // Corrupted or unavailable storage — fall through to a fresh seed.
    }
  }

  state = createMockState();
  return state;
}

function persist(): void {
  if (!import.meta.client || !state) return;
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    // Out of quota or private mode: the demo still works for this session.
  }
}

function readSession(): string | null {
  if (!import.meta.client) return null;
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function writeSession(userId: string | null): void {
  if (!import.meta.client) return;
  try {
    if (userId) localStorage.setItem(SESSION_KEY, userId);
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignore: sign-in simply will not survive a reload.
  }
}

interface DemoRequestOptions {
  method?: string;
  body?: unknown;
  query?: Record<string, unknown>;
}

/** Mirrors what `$fetch` throws, so `toApiFailure` keeps working unchanged. */
class DemoFetchError extends Error {
  statusCode: number;
  data: unknown;

  constructor(status: number, body: { statusMessage?: string }) {
    super(body.statusMessage ?? "Request failed");
    this.name = "DemoFetchError";
    this.statusCode = status;
    this.data = body;
  }
}

export function demoApiRequest<T>(url: string, options: DemoRequestOptions = {}): Promise<T> {
  const request: MockRequest = {
    method: options.method ?? "GET",
    path: url,
    body: options.body,
    query: Object.fromEntries(
      Object.entries(options.query ?? {})
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)]),
    ),
    userId: readSession(),
  };

  const response = handleMockRequest(loadState(), request);

  if (response.session) writeSession(response.session.userId);
  if (request.method !== "GET") persist();

  if (response.status >= 400) {
    return Promise.reject(new DemoFetchError(response.status, response.body as { statusMessage?: string }));
  }
  return Promise.resolve(response.body as T);
}
