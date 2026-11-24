import type { Exercise } from '../types';
import { d1Hook } from './d1Hook';
import { d1Loop } from './d1Loop';
import { d4Criteria } from './d4Criteria';
import { upcomingExercises } from './upcoming';

/** In ordine di programma: "0", poi D1·1, D1·2 e così via */
export const exercises: Exercise[] = [d1Loop, d1Hook, d4Criteria, ...upcomingExercises].sort((a, b) =>
  a.id.localeCompare(b.id),
);
