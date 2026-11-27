import type { Actor, Flow, LessonScene } from './types';

export interface Resolved {
  actors: Actor[];
  hot: ReadonlySet<string>;
  flows: Flow[];
}

/** Stato della scena al fotogramma indicato: i cambiamenti si sommano dal primo in poi */
export function resolveFrame(scene: LessonScene, index: number): Resolved {
  const patches = new Map<string, Partial<Actor>>();
  for (const frame of scene.frames.slice(0, index + 1)) {
    for (const [id, patch] of Object.entries(frame.set ?? {})) {
      const { mark, ...rest } = patch;
      const merged: Partial<Actor> = { ...patches.get(id), ...rest };
      if (mark !== undefined) merged.mark = mark === null ? undefined : mark;
      patches.set(id, merged);
    }
  }
  const actors = scene.actors
    .filter(({ from = 0, until = Number.POSITIVE_INFINITY }) => index >= from && index <= until)
    .map((actor) => ({ ...actor, ...patches.get(actor.id) }));
  const frame = scene.frames[index];
  return { actors, hot: new Set(frame.hot ?? []), flows: frame.flows ?? [] };
}
