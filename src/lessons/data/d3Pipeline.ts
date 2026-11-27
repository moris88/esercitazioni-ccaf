import { box, code, frame, note, scene } from '../helpers';
import type { Lesson } from '../types';

export const d3Pipeline: Lesson = {
  id: 'd3-pipeline',
  group: 'd3',
  code: 'D3·3',
  title: 'Iterare e CI/CD',
  lesson: 'Dominio 3 · Parte 3 · Iterare e CI/CD',
  goal: 'Imparare a dare esempi e farsi intervistare, a usare Claude Code in una pipeline e a far rivedere il codice a una sessione indipendente.',
  exam: 'In CI: -p obbligatorio, output JSON, limiti di turni e spesa; batch per il non urgente, mai per il merge; chi scrive non revisiona.',
  scenes: [
    scene({
      id: 'iterare',
      label: 'Esempi, test e intervista',
      description: 'Tre modi per far capire a Claude ciò che vuoi, quando le parole non bastano.',
      takeaway:
        'Prosa incoerente: due o tre esempi di input e output. Si guida con i test (TDD). Requisiti ambigui: fatti intervistare prima di implementare.',
      actors: [
        code(
          'ex',
          'Esempi concreti',
          '"5 gennaio 2024" → "2024-01-05"\n"31/12/23" → "2023-12-31"\n"mar 2024" → "2024-03-01"',
          26,
          18,
          { w: 44 },
        ),
        box('t1', '1 · Scrivi il test', 14, 58, { w: 20, from: 1 }),
        box('t2', '2 · Fallisce', 38, 58, { w: 20, from: 2 }),
        box('t3', '3 · Dai l’errore', 62, 58, { w: 20, from: 2 }),
        box('t4', '4 · Correggi', 86, 58, { w: 20, from: 2, body: 'e ripeti' }),
        code(
          'int',
          'Intervista',
          '«Prima di implementare:\n JWT o sessione?\n token di aggiornamento?\n durata della sessione?»',
          76,
          18,
          { w: 36, from: 3 },
        ),
        box('dep', 'Problemi collegati', 24, 88, {
          w: 34,
          from: 4,
          body: 'interdipendenti: un unico messaggio',
        }),
        box('ind', 'Problemi indipendenti', 70, 88, { w: 34, from: 4, body: 'uno alla volta, in sequenza' }),
      ],
      links: [
        ['t1', 't2'],
        ['t2', 't3'],
        ['t3', 't4'],
      ],
      frames: [
        frame(
          '«Formatta le date in modo coerente» si può interpretare in molti modi. Meglio mostrare due o tre esempi.',
          {
            hot: ['ex'],
          },
        ),
        frame('Test-driven development: si parte da un test che descrive il risultato voluto.', {
          hot: ['t1'],
        }),
        frame('Il test fallisce, si dà l’errore a Claude, che corregge. Si ripete finché passa.', {
          hot: ['t2', 't3', 't4'],
          flows: [['t3', 't4']],
        }),
        frame('Se i requisiti sono ambigui, si lascia che Claude faccia domande prima di scrivere codice.', {
          hot: ['int'],
        }),
        frame('Più problemi: se sono collegati si danno insieme; se sono indipendenti, uno alla volta.', {
          hot: ['dep', 'ind'],
        }),
      ],
    }),
    scene({
      id: 'ci',
      label: 'Claude Code in una pipeline',
      description: 'In una pipeline automatica nessuno risponde alle domande: servono opzioni dedicate.',
      takeaway:
        'In CI: -p obbligatorio, --output-format json per leggere l’esito, --max-turns e --max-budget-usd come freni.',
      actors: [
        code(
          'cmd',
          'Comando nella pipeline',
          'claude -p "Esamina questa PR"\n  --output-format json\n  --json-schema \'{…}\'\n  --max-turns 10\n  --max-budget-usd 2',
          28,
          30,
          { w: 50 },
        ),
        box('p', '-p', 80, 12, { w: 22, from: 1, body: 'non interattivo:\nobbligatorio in CI', mark: 'ok' }),
        box('json', 'output json', 80, 36, { w: 22, from: 2, body: 'leggibile da un\nprogramma' }),
        box('schema', '--json-schema', 80, 60, { w: 22, from: 3, body: 'convalida lo\nschema finale' }),
        box('lim', 'Limiti', 80, 84, { w: 22, from: 4, body: 'turni e spesa\nmassimi' }),
        note('wait', 'Senza -p', 28, 72, {
          w: 36,
          from: 5,
          body: 'la pipeline resta in attesa di un input che nessuno darà',
        }),
      ],
      frames: [
        frame('Un comando di Claude Code dentro una pipeline, per esempio in GitHub Actions.', {
          hot: ['cmd'],
        }),
        frame('-p lo rende non interattivo. Senza, resterebbe fermo ad aspettare una persona.', {
          hot: ['p'],
        }),
        frame('--output-format json: il risultato arriva in un formato che un programma sa leggere.', {
          hot: ['json'],
        }),
        frame('--json-schema: l’esito finale viene controllato rispetto a uno schema.', { hot: ['schema'] }),
        frame('--max-turns e --max-budget-usd: limiti rigidi su giri e spesa, per non avere sorprese.', {
          hot: ['lim'],
        }),
        frame('Ecco perché -p è obbligatorio: senza, la pipeline si blocca per sempre.', {
          hot: ['wait'],
          set: { wait: { mark: 'no' } },
        }),
      ],
    }),
    scene({
      id: 'batch-review',
      label: 'Batch e revisione indipendente',
      description: 'Quando il batch conviene e perché chi scrive il codice non dovrebbe rivederlo.',
      takeaway:
        'Batch per ciò che non è urgente, mai per i controlli prima del merge. Chi scrive non revisiona: serve una nuova sessione senza contesto condiviso.',
      actors: [
        box('yes', 'Batch: sì', 24, 18, {
          w: 36,
          body: 'report notturni, audit settimanali\n−50% di costo, fino a 24 ore',
        }),
        box('no', 'Batch: no', 76, 18, {
          w: 36,
          from: 1,
          body: 'controlli prima del merge\ninterazioni in tempo reale',
          mark: 'no',
        }),
        box('s1', 'Sessione 1', 16, 56, { w: 22, from: 2, body: 'Claude scrive il codice' }),
        box('s2', 'Nuova sessione', 50, 56, { w: 24, from: 3, body: 'nessun contesto condiviso' }),
        box('rev', 'Sessione 2', 84, 56, { w: 22, from: 4, body: 'revisiona senza preconcetti', mark: 'ok' }),
        note('why', 'Perché', 50, 85, {
          w: 76,
          from: 5,
          body: 'nella stessa sessione Claude ricorda i motivi di ogni scelta e tende a non metterle in discussione',
        }),
      ],
      links: [
        ['s1', 's2'],
        ['s2', 'rev'],
      ],
      frames: [
        frame('Il batch costa la metà, ma può impiegare fino a 24 ore e non ha garanzie di tempo.', {
          hot: ['yes'],
        }),
        frame(
          'Per questo non va usato dove qualcuno aspetta: controlli bloccanti prima del merge o lavoro interattivo.',
          {
            hot: ['no'],
          },
        ),
        frame('Seconda questione: chi revisiona il codice. Una prima sessione lo scrive.', { hot: ['s1'] }),
        frame('Per la revisione si apre una sessione nuova, senza alcun contesto condiviso.', {
          hot: ['s2'],
          flows: [['s1', 's2', 'solo il codice']],
        }),
        frame('La seconda sessione guarda il codice con occhi nuovi.', {
          hot: ['rev'],
          flows: [['s2', 'rev']],
        }),
        frame(
          'Nella stessa sessione il modello ricorderebbe le ragioni delle proprie scelte e le difenderebbe.',
          {
            hot: ['why'],
          },
        ),
      ],
    }),
  ],
};
