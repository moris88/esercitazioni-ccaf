import { describe, expect, it } from 'vitest';
import type { Step } from '../types';
import { createReducer, initialState, isFinished } from './playerReducer';
import { stepMs, typingMs } from './timing';

const steps: Step[] = [
  { kind: 'command', text: 'python prova.py' },
  { kind: 'output', text: 'ok' },
];
const reducer = createReducer(steps);
const playingState = { ...initialState, playing: true };

describe('playerReducer', () => {
  it('dovrebbe ignorare il tempo quando è in pausa', () => {
    expect(reducer(initialState, { type: 'tick', ms: 5000 })).toBe(initialState);
  });

  it('dovrebbe passare al passo successivo quando scade la durata', () => {
    const state = reducer(playingState, { type: 'tick', ms: stepMs(steps[0]) });
    expect(state).toEqual({ index: 1, elapsed: 0, playing: true });
  });

  it('dovrebbe fermarsi alla fine e ripartire da capo', () => {
    const end = reducer(playingState, { type: 'tick', ms: 60_000 });
    expect(end.playing).toBe(false);
    expect(isFinished(end, steps)).toBe(true);
    expect(reducer(end, { type: 'toggle' })).toEqual(playingState);
  });

  it('dovrebbe completare il testo prima di avanzare', () => {
    const typed = reducer(initialState, { type: 'next' });
    expect(typed).toEqual({ index: 0, elapsed: typingMs(steps[0]), playing: false });
    expect(reducer(typed, { type: 'next' }).index).toBe(1);
  });

  it('dovrebbe restare nei limiti andando indietro', () => {
    expect(reducer(initialState, { type: 'prev' }).index).toBe(0);
  });
});
