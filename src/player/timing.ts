import type { Step } from '../types';

/** Caratteri al secondo: la digitazione umana è più lenta della risposta */
const HUMAN_SPEED = 32;
const STREAM_SPEED = 75;
const MAX_TYPING_MS = 6000;
/** Durata minima di una risposta: comprende i puntini di attesa */
const MIN_ANSWER_MS = 1500;

export function typingMs(step: Step): number {
  if (step.kind !== 'command' && step.kind !== 'message') return 0;
  const isHuman = step.kind === 'command' || step.role === 'user';
  const ms = (step.text.length / (isHuman ? HUMAN_SPEED : STREAM_SPEED)) * 1000;
  return Math.min(MAX_TYPING_MS, isHuman ? ms : Math.max(MIN_ANSWER_MS, ms));
}

/** Pausa di lettura dopo che il passo è completo */
function holdMs(step: Step): number {
  if (step.note || step.kind === 'table') return 3500;
  return step.kind === 'divider' ? 600 : 1300;
}

export function stepMs(step: Step): number {
  return typingMs(step) + holdMs(step);
}
