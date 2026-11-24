import { useEffect } from 'react';
import type { Player } from './usePlayer';

const SHORTCUTS = new Map<string, 'toggle' | 'next' | 'prev' | 'restart'>([
  [' ', 'toggle'],
  ['ArrowRight', 'next'],
  ['ArrowLeft', 'prev'],
  ['r', 'restart'],
]);

export function usePlayerKeys(dispatch: Player['dispatch']) {
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      const type = SHORTCUTS.get(event.key);
      if (!type || event.ctrlKey || event.metaKey || event.altKey) return;
      const { target } = event;
      if (target instanceof HTMLInputElement) return;
      // La barra spaziatrice su un pulsante deve attivare il pulsante
      if (event.key === ' ' && target instanceof HTMLButtonElement) return;
      event.preventDefault();
      dispatch({ type });
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dispatch]);
}
