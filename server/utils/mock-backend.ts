import { createMockState, type MockState } from "#shared/mock/state";

/**
 * One state instance per server process, kept on `globalThis` so Nitro's dev-time
 * module reloads do not wipe the seeded orders.
 */
const globalScope = globalThis as typeof globalThis & { __izMockState__?: MockState };

export const mockState: MockState = (globalScope.__izMockState__ ??= createMockState());

/** session token -> user id */
export const mockSessions: Map<string, string> = ((globalScope as { __izMockSessions__?: Map<string, string> }).__izMockSessions__ ??= new Map());
