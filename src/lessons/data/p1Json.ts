import { box, code, frame, note, scene } from '../helpers';
import type { Lesson } from '../types';

export const p1Json: Lesson = {
  id: 'p1-json',
  group: 'pre',
  code: 'P·1',
  title: 'JSON, schema e regex',
  lesson: 'Pre-corso · Prerequisiti tecnici',
  goal: 'Capire che cos’è un JSON, che cosa controlla uno schema e la differenza tra un controllo deterministico e uno del modello.',
  exam: 'Schema ≠ correttezza; deterministico (regex, codice) contro probabilistico (modello).',
  scenes: [
    scene({
      id: 'json',
      label: 'Che cos’è un JSON',
      description:
        'Un JSON è un modo ordinato di scrivere dati: un piccolo errore lo rende illeggibile per un programma.',
      takeaway:
        'JSON: oggetti tra { }, liste tra [ ], chiavi tra virgolette doppie. Una virgola di troppo e il programma non lo legge.',
      actors: [
        code(
          'ok',
          'JSON valido',
          '{ "nome": "Mario Rossi",\n  "eta": 42,\n  "premium": true,\n  "ordini": ["A-101", "A-102"],\n  "note": null }',
          28,
          36,
          { w: 44 },
        ),
        box('types', 'Tipi di valore', 76, 20, {
          w: 36,
          from: 1,
          body: 'testo · numero · vero/falso\nnull · oggetto { } · lista [ ]',
        }),
        code('bad', 'JSON non valido', '{ "nome": "Mario",\n  "eta": 42, }', 28, 78, { w: 36, from: 2 }),
        box('prog', 'Programma', 76, 70, { w: 28, from: 3, body: 'non riesce a leggerlo' }),
      ],
      links: [['bad', 'prog']],
      frames: [
        frame('Un JSON descrive dei dati con coppie nome-valore, tra parentesi graffe.', { hot: ['ok'] }),
        frame('I valori possono essere testo, numeri, vero o falso, nulla, oppure oggetti e liste.', {
          hot: ['types'],
        }),
        frame('Qui c’è una virgola di troppo alla fine: sembra un dettaglio.', {
          hot: ['bad'],
          set: { bad: { mark: 'no' } },
        }),
        frame(
          'Ma il programma che deve leggerlo si blocca. Per questo, quando Claude produce JSON, conviene farlo controllare.',
          {
            hot: ['prog'],
            flows: [['bad', 'prog']],
            set: { prog: { mark: 'no' } },
          },
        ),
      ],
    }),
    scene({
      id: 'schema',
      label: 'Lo schema',
      description:
        'Uno schema descrive la forma attesa di un JSON: controlla la forma, non la verità dei dati.',
      takeaway: 'Lo schema garantisce la forma dei dati, non che il contenuto sia corretto.',
      actors: [
        code(
          'schema',
          'Schema',
          '"type": "object"\n"properties": {\n  "categoria": enum [fattura,\n     reclamo, altro]\n  "importo": numero }\n"required": ["categoria"]',
          26,
          40,
          { w: 44 },
        ),
        code('data', 'Dati', '{ "categoria": "fattura",\n  "importo": 9999999 }', 76, 24, { w: 40, from: 1 }),
        box('check', 'Controllo', 76, 56, { w: 30, from: 2, body: 'forma ✓', mark: 'ok' }),
        note('real', 'Ma è vero?', 50, 88, {
          w: 70,
          from: 3,
          body: 'lo schema non sa se l’importo è plausibile: serve un altro controllo',
        }),
      ],
      links: [
        ['schema', 'check'],
        ['data', 'check'],
      ],
      frames: [
        frame('Lo schema elenca i campi, i loro tipi e quali sono obbligatori.', { hot: ['schema'] }),
        frame('Poi arrivano dei dati, scritti da Claude o da una persona.', { hot: ['data'] }),
        frame('Il controllo conferma che campi e tipi sono quelli previsti.', {
          hot: ['check'],
          flows: [
            ['schema', 'check'],
            ['data', 'check'],
          ],
        }),
        frame(
          'Ma uno schema non sa se un importo è realistico: la forma è giusta, il contenuto può essere sbagliato.',
          {
            hot: ['real'],
          },
        ),
      ],
    }),
    scene({
      id: 'regex',
      label: 'Regola o modello?',
      description:
        'Due modi di controllare un codice fiscale: una regola precisa oppure il giudizio del modello.',
      takeaway:
        'Una regola (regex, codice) dà sempre lo stesso esito; il modello è probabilistico. Per ciò che deve essere garantito, serve il codice.',
      actors: [
        code('in', 'Testo da controllare', 'AB-12345', 14, 40, { w: 22 }),
        code('regex', 'Regex', '^[A-Z]{2}-\\d{5}$', 50, 18, { w: 28, from: 1 }),
        box('model', 'Il modello', 50, 62, { w: 28, from: 2, body: 'risponde «sembra valido»' }),
        box('r1', 'Stesso esito', 86, 18, { w: 22, from: 3, body: 'sempre', mark: 'ok' }),
        box('r2', 'Può variare', 86, 62, { w: 22, from: 3, body: 'da una volta all’altra', mark: 'no' }),
      ],
      links: [
        ['in', 'regex'],
        ['in', 'model'],
        ['regex', 'r1'],
        ['model', 'r2'],
      ],
      frames: [
        frame('Dobbiamo controllare se un codice ha il formato giusto.', { hot: ['in'] }),
        frame('Una regex è una regola precisa: due lettere, un trattino, cinque cifre.', {
          hot: ['regex'],
          flows: [['in', 'regex']],
        }),
        frame('Si può anche chiedere al modello se «sembra valido».', {
          hot: ['model'],
          flows: [['in', 'model']],
        }),
        frame(
          'La regola dà sempre lo stesso esito; il modello può rispondere in modo diverso la volta dopo.',
          {
            hot: ['r1', 'r2'],
          },
        ),
      ],
    }),
  ],
};
