import { describe, expect, it } from 'vitest';
import { createReducer, initialState, isFinished } from '../player/playerReducer';
import { exercises } from './index';

const scenes = exercises.flatMap((exercise) =>
  exercise.scenes.map((scene) => ({ name: `${exercise.code} / ${scene.id}`, exercise, scene })),
);

describe('exercises', () => {
  it('dovrebbe elencare le 17 esercitazioni con id univoci', () => {
    expect(new Set(exercises.map(({ id }) => id)).size).toBe(17);
  });

  it.each(scenes)('dovrebbe riprodurre fino alla fine $name', ({ scene }) => {
    const reducer = createReducer(scene.steps);
    const end = reducer({ ...initialState, playing: true }, { type: 'tick', ms: 3_600_000 });
    expect(isFinished(end, scene.steps)).toBe(true);
  });

  it.each(scenes)('dovrebbe usare riferimenti validi in $name', ({ exercise, scene }) => {
    const nodes = scene.diagram?.nodes.map(({ id }) => id) ?? [];
    const edges = scene.diagram?.edges.map(({ from, to }) => `${from}-${to}`) ?? [];
    for (const step of scene.steps) {
      for (const index of step.observe ?? []) expect(exercise.observe[index]).toBeDefined();
      step.path?.forEach((id, i, path) => {
        expect(nodes).toContain(id);
        if (i > 0) expect(edges).toContain(`${path[i - 1]}-${id}`);
      });
      if (step.pane === 1) expect(scene.panes).toBeDefined();
    }
  });

  it.each(exercises.filter(({ scenes }) => scenes.length > 0))(
    'dovrebbe rivelare tutti i punti da osservare in $code',
    (exercise) => {
      const revealed = exercise.scenes.flatMap((s) => s.steps.flatMap((step) => step.observe ?? []));
      expect(new Set(revealed).size).toBe(exercise.observe.length);
    },
  );
});
