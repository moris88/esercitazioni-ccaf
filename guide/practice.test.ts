import { expect, it } from 'vitest';
import { exercises } from '../src/exercises';
import { prePractice } from './practice';
import { domainPractice } from './practiceDomains';

it('dovrebbe avere i passi per tutte e sole le esercitazioni del simulatore', () => {
  const ids = Object.keys({ ...prePractice, ...domainPractice });
  expect(ids.sort()).toEqual(exercises.map(({ id }) => id).sort());
});
