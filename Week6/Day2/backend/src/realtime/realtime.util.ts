
/**
 * Emit a Socket.IO event from anywhere without importing the gateway.
 * Avoids circular deps. Use sparingly; prefer injecting a dedicated service where possible.
 */
export function emitRealtime(event: string, data: any, room?: string) {
  try {
    const fn = (globalThis as any).__realtimeEmit;
    if (typeof fn === 'function') fn(event, data, room);
  } catch {}
}
