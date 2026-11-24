import { useEffect, useMemo, useReducer, useState } from 'react';
import type { Step } from '../types';
import { createReducer, initialState, isFinished } from './playerReducer';
import { typingMs } from './timing';

export function usePlayer(steps: Step[]) {
  const reducer = useMemo(() => createReducer(steps), [steps]);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!state.playing) return;
    let last = performance.now();
    function loop(now: number) {
      dispatch({ type: 'tick', ms: Math.max(0, now - last) * speed });
      last = now;
      frame = requestAnimationFrame(loop);
    }
    let frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [state.playing, speed]);

  const typing = typingMs(steps[state.index]);
  return {
    index: state.index,
    playing: state.playing,
    finished: isFinished(state, steps),
    /** Avanzamento del testo del passo corrente, da 0 a 1 */
    progress: typing === 0 ? 1 : Math.min(1, state.elapsed / typing),
    speed,
    setSpeed,
    dispatch,
  };
}

export type Player = ReturnType<typeof usePlayer>;
