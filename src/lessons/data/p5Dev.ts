import { box, code, frame, note, scene } from '../helpers';
import type { Lesson } from '../types';

export const p5Dev: Lesson = {
  id: 'p5-sviluppo',
  group: 'pre',
  code: 'P·5',
  title: 'Git, CI/CD e regole garantite',
  lesson: 'Pre-corso · Sviluppo software',
  goal: 'Seguire una modifica dal branch alla pipeline e distinguere ciò che il codice garantisce da ciò che il modello interpreta.',
  exam: 'Il prompt aumenta la probabilità di un comportamento; il codice lo garantisce.',
  scenes: [
    scene({
      id: 'git',
      label: 'Dal branch alla pipeline',
      description:
        'Il percorso di una modifica: un ramo, una richiesta di revisione, i controlli automatici e l’unione.',
      takeaway:
        'Si lavora su un branch, si apre una pull request, la CI controlla in automatico e solo dopo si fa il merge.',
      actors: [
        box('main', 'main', 14, 30, { w: 16, body: 'codice approvato' }),
        box('branch', 'Branch', 34, 70, { w: 18, from: 1, body: 'la tua modifica' }),
        box('pr', 'Pull request', 56, 30, { w: 22, from: 2, body: 'chiedi la revisione' }),
        box('ci', 'CI', 78, 70, { w: 16, from: 3, body: 'test e lint\nautomatici' }),
        box('merge', 'Merge', 86, 30, { w: 16, from: 4, body: 'entra in main', mark: 'ok' }),
      ],
      links: [
        ['main', 'branch'],
        ['branch', 'pr'],
        ['pr', 'ci'],
        ['ci', 'merge'],
      ],
      frames: [
        frame('main contiene il codice approvato.', { hot: ['main'] }),
        frame('Per cambiare qualcosa si crea un branch: una copia di lavoro, senza toccare main.', {
          hot: ['branch'],
          flows: [['main', 'branch', 'git switch -c']],
        }),
        frame('Poi si apre una pull request: la richiesta di far rivedere la modifica.', {
          hot: ['pr'],
          flows: [['branch', 'pr']],
        }),
        frame('La pipeline CI esegue test e controlli automatici a ogni modifica.', {
          hot: ['ci'],
          flows: [['pr', 'ci']],
        }),
        frame('Se tutto passa e la revisione è positiva, si fa il merge e la modifica entra in main.', {
          hot: ['merge'],
          flows: [['ci', 'merge', 'verde']],
        }),
      ],
    }),
    scene({
      id: 'deterministico',
      label: 'Dove mettere la regola',
      description: 'Una regola importante può stare nel prompt oppure nel codice: l’effetto è molto diverso.',
      takeaway:
        'Il prompt aumenta la probabilità che Claude si comporti bene; il codice lo garantisce. Ciò che deve valere sempre va nel codice.',
      actors: [
        note('p', 'Regola nel prompt', 24, 22, { w: 36, body: '«non rimborsare oltre 100 euro»' }),
        code(
          'c',
          'Regola nel codice',
          'def rimborsa(importo):\n    if importo > 100:\n        raise Errore',
          74,
          22,
          { w: 40 },
        ),
        box('pr', 'Probabilistico', 24, 62, { w: 30, from: 1, body: 'quasi sempre rispettata' }),
        box('de', 'Deterministico', 74, 62, { w: 30, from: 2, body: 'rispettata sempre' }),
        box('use', 'Prompt per', 24, 88, { w: 34, from: 3, body: 'tono, stile, preferenze' }),
        box('use2', 'Codice per', 74, 88, { w: 34, from: 3, body: 'denaro, sicurezza, limiti' }),
      ],
      frames: [
        frame('La stessa regola, scritta in due modi.', { hot: ['p', 'c'] }),
        frame('Nel prompt, Claude la rispetta quasi sempre: è una probabilità, non una garanzia.', {
          hot: ['pr'],
          set: { p: { mark: 'no' } },
        }),
        frame('Nel codice, nessuna richiesta può superarla: il programma si ferma.', {
          hot: ['de'],
          set: { c: { mark: 'ok' } },
        }),
        frame('Si usa il prompt per le preferenze e il codice per ciò che non deve mai sbagliare.', {
          hot: ['use', 'use2'],
        }),
      ],
    }),
  ],
};
