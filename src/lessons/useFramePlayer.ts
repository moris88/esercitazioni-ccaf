import { useEffect, useMemo, useReducer, useState } from 'react';
import { createFrameReducer, frameMs, initialFrameState } from './framePlayer';
import type { LessonScene } from './types';

export function useFramePlayer(scene: LessonScene) {
  const total = scene.frames.length;
  const reducer = useMemo(() => createFrameReducer(total), [total]);
  const [state, dispatch] = useReducer(reducer, { ...initialFrameState, playing: true });
  const [speed, setSpeed] = useState(1);
  // Parte da sola a ogni apertura di una scena: il componente si rimonta quando la scena cambia
  const { index, playing } = state;

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => dispatch({ type: 'tick' }), frameMs(scene.frames[index].caption) / speed);
    return () => clearTimeout(timer);
  }, [playing, index, speed, scene]);

  return { index, total, playing, finished: index >= total - 1 && !playing, speed, setSpeed, dispatch };
}

export type FramePlayer = ReturnType<typeof useFramePlayer>;
