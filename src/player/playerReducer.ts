import type { Step } from '../types';
import { stepMs, typingMs } from './timing';

export interface PlayerState {
  index: number;
  elapsed: number;
  playing: boolean;
}

export type PlayerAction =
  | { type: 'tick'; ms: number }
  | { type: 'seek'; index: number }
  | { type: 'toggle' | 'next' | 'prev' | 'restart' };

export const initialState: PlayerState = { index: 0, elapsed: 0, playing: false };

export function isFinished(state: PlayerState, steps: Step[]): boolean {
  return state.index === steps.length - 1 && state.elapsed >= stepMs(steps[state.index]);
}

/** Salto manuale: il passo appare già completo e la riproduzione si ferma */
function jump(steps: Step[], index: number): PlayerState {
  const target = Math.max(0, Math.min(index, steps.length - 1));
  const isLast = target === steps.length - 1;
  return { index: target, elapsed: (isLast ? stepMs : typingMs)(steps[target]), playing: false };
}

export function createReducer(steps: Step[]) {
  return (state: PlayerState, action: PlayerAction): PlayerState => {
    switch (action.type) {
      case 'tick': {
        if (!state.playing) return state;
        let { index } = state;
        let elapsed = state.elapsed + action.ms;
        while (index < steps.length - 1 && elapsed >= stepMs(steps[index])) {
          elapsed -= stepMs(steps[index]);
          index += 1;
        }
        const next = { index, elapsed, playing: true };
        return { ...next, playing: !isFinished(next, steps) };
      }
      case 'toggle':
        return isFinished(state, steps)
          ? { ...initialState, playing: true }
          : { ...state, playing: !state.playing };
      case 'next':
        return jump(steps, state.elapsed < typingMs(steps[state.index]) ? state.index : state.index + 1);
      case 'prev':
        return jump(steps, state.index - 1);
      case 'seek':
        return jump(steps, action.index);
      case 'restart':
        return { ...initialState, playing: true };
    }
  };
}
