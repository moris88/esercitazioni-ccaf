import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

/** Frammento dell'URL senza il cancelletto */
export function useHash(): string {
  return useSyncExternalStore(subscribe, () => window.location.hash.slice(1));
}
