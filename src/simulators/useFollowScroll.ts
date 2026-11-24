import { useEffect, useRef } from 'react';

/** Mantiene in vista la fine del contenuto mentre la riproduzione avanza */
export function useFollowScroll(index: number, progress: number) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: lo scroll dipende dall'avanzamento
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'nearest' });
  }, [index, progress]);

  return bottomRef;
}
