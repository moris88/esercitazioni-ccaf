import { describe, expect, it } from 'vitest';
import { createFrameReducer, frameMs, initialFrameState, isLastFrame } from './framePlayer';
import { lessons } from './index';
import { resolveFrame } from './resolve';
import type { Actor } from './types';

const scenes = lessons.flatMap((lesson) =>
  lesson.scenes.map((scene) => ({ name: `${lesson.code} / ${scene.id}`, lesson, scene })),
);

/** Stima prudente dell'ingombro di un riquadro, in percentuale della scena */
function extent(actor: Actor) {
  const width = actor.w ?? 20;
  const perLine = (size: number) => Math.max(8, (width * 7 - 24) / size);
  const wrap = (text: string, size: number) =>
    text.split('\n').reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / perLine(size))), 0);
  const lines =
    wrap(actor.label, 7.8) * 1.15 +
    (actor.body ? wrap(actor.body, 6.5) : 0) +
    (actor.kind === 'meter' ? 1.5 : 0);
  const height = 8 + lines * 4.1;
  return {
    left: actor.x - width / 2,
    right: actor.x + width / 2,
    top: actor.y - height / 2,
    bottom: actor.y + height / 2,
  };
}

describe('animazioni', () => {
  it('dovrebbe avere id univoci per le lezioni e per le scene', () => {
    expect(new Set(lessons.map(({ id }) => id)).size).toBe(lessons.length);
    for (const lesson of lessons) {
      expect(new Set(lesson.scenes.map(({ id }) => id)).size).toBe(lesson.scenes.length);
    }
  });

  it.each(scenes)('dovrebbe avere testi completi in $name', ({ scene }) => {
    expect(scene.description.length).toBeGreaterThan(20);
    expect(scene.takeaway.length).toBeGreaterThan(20);
    expect(scene.frames.length).toBeGreaterThanOrEqual(4);
    for (const frame of scene.frames) expect(frame.caption.length).toBeGreaterThan(10);
  });

  it.each(scenes)('dovrebbe usare riferimenti validi in $name', ({ scene }) => {
    const ids = new Set(scene.actors.map(({ id }) => id));
    expect(ids.size).toBe(scene.actors.length);
    for (const [from, to] of scene.links) {
      expect(ids.has(from) && ids.has(to)).toBe(true);
    }
    scene.frames.forEach((frame, index) => {
      const visible = new Set(resolveFrame(scene, index).actors.map(({ id }) => id));
      for (const id of frame.hot ?? [])
        expect(visible.has(id), `hot ${id} al fotogramma ${index}`).toBe(true);
      for (const [from, to] of frame.flows ?? []) {
        expect(visible.has(from) && visible.has(to), `flusso ${from}-${to} al fotogramma ${index}`).toBe(
          true,
        );
      }
      for (const id of Object.keys(frame.set ?? {})) expect(ids.has(id), `set ${id}`).toBe(true);
    });
  });

  it.each(scenes)(
    'dovrebbe tenere i riquadri dentro la scena e senza sovrapposizioni in $name',
    ({ scene }) => {
      scene.frames.forEach((_, index) => {
        const boxes = resolveFrame(scene, index).actors.map((actor) => ({ id: actor.id, ...extent(actor) }));
        for (const { id, left, right, top, bottom } of boxes) {
          expect(left, `${id} a sinistra`).toBeGreaterThanOrEqual(0);
          expect(right, `${id} a destra`).toBeLessThanOrEqual(100);
          expect(top, `${id} in alto (fotogramma ${index})`).toBeGreaterThanOrEqual(0);
          expect(bottom, `${id} in basso (fotogramma ${index})`).toBeLessThanOrEqual(100);
        }
        boxes.forEach((a, i) => {
          for (const b of boxes.slice(i + 1)) {
            const overlap = a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
            expect(overlap, `${a.id} e ${b.id} si sovrappongono al fotogramma ${index}`).toBe(false);
          }
        });
      });
    },
  );
});

describe('framePlayer', () => {
  const reducer = createFrameReducer(3);

  it('dovrebbe avanzare da solo e fermarsi all’ultimo fotogramma', () => {
    let state = reducer(initialFrameState, { type: 'toggle' });
    state = reducer(state, { type: 'tick' });
    state = reducer(state, { type: 'tick' });
    expect(state).toEqual({ index: 2, playing: false });
    expect(isLastFrame(state, 3)).toBe(true);
  });

  it('dovrebbe ripartire dall’inizio se si preme play alla fine', () => {
    expect(reducer({ index: 2, playing: false }, { type: 'toggle' })).toEqual({ index: 0, playing: true });
  });

  it('dovrebbe fermare la riproduzione nei salti manuali e restare nei limiti', () => {
    expect(reducer({ index: 0, playing: true }, { type: 'prev' })).toEqual({ index: 0, playing: false });
    expect(reducer({ index: 1, playing: true }, { type: 'seek', index: 9 })).toEqual({
      index: 2,
      playing: false,
    });
  });

  it('dovrebbe dare più tempo alle frasi lunghe', () => {
    expect(frameMs('x'.repeat(200))).toBeGreaterThan(frameMs('breve'));
  });
});
