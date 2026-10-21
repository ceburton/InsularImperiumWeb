// Screen wake lock shared by the reader and the audiobook player; browsers without it simply let the screen sleep.
export async function acquireWakeLock(holder: { current: WakeLockSentinel | null }, wanted: () => boolean) {
  try {
    if (!('wakeLock' in navigator) || holder.current || document.visibilityState !== 'visible') return;
    const lock = await navigator.wakeLock.request('screen');
    if (!wanted() || holder.current) { void lock.release(); return; }
    holder.current = lock;
    lock.addEventListener('release', () => { if (holder.current === lock) holder.current = null; });
  } catch { /* Wake lock is optional. */ }
}

export function releaseWakeLock(holder: { current: WakeLockSentinel | null }) {
  const lock = holder.current;
  holder.current = null;
  lock?.release().catch(() => { /* Already released. */ });
}
