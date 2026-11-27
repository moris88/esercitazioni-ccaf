import type { Actor, ActorPatch, Flow, Frame, LessonScene } from './types';

type Extras = Omit<Actor, 'id' | 'label' | 'x' | 'y'>;

/** Riquadro generico */
export const box = (id: string, label: string, x: number, y: number, extras: Extras = {}): Actor => ({
  id,
  label,
  x,
  y,
  ...extras,
});
/** Riquadro scuro con testo a spaziatura fissa: JSON, comandi, file */
export const code = (
  id: string,
  label: string,
  body: string,
  x: number,
  y: number,
  extras: Extras = {},
): Actor => box(id, label, x, y, { kind: 'code', body, ...extras });
/** Riquadro tratteggiato per un commento o una regola */
export const note = (id: string, label: string, x: number, y: number, extras: Extras = {}): Actor =>
  box(id, label, x, y, { kind: 'note', ...extras });
/** Barra di riempimento (contesto, budget, percentuali) */
export const meter = (
  id: string,
  label: string,
  value: number,
  x: number,
  y: number,
  extras: Extras = {},
): Actor => box(id, label, x, y, { kind: 'meter', value, ...extras });

interface FrameOptions {
  hot?: string[];
  flows?: Flow[];
  set?: Record<string, ActorPatch>;
}

/** Un fotogramma: la frase, poi ciò che si accende, che viaggia e che cambia */
export const frame = (caption: string, options: FrameOptions = {}): Frame => ({ caption, ...options });

interface SceneInput extends Omit<LessonScene, 'links'> {
  links?: LessonScene['links'];
}

export const scene = (input: SceneInput): LessonScene => ({ links: [], ...input });
