import { box, code, frame, scene } from '../helpers';
import type { Lesson } from '../types';

export const p6Data: Lesson = {
  id: 'p6-dati',
  group: 'pre',
  code: 'P·6',
  title: 'SQL, transazioni e dati personali',
  lesson: 'Pre-corso · Dati e archiviazione',
  goal: 'Leggere una query semplice e riconoscere le buone pratiche quando un agente accede a un database.',
  exam: 'Privilegio minimo, query parametrizzate, pochi risultati; «nessun risultato» è diverso da «errore».',
  scenes: [
    scene({
      id: 'transazione',
      label: 'Una transazione',
      description: 'Un bonifico sono due operazioni: o riescono tutte e due, o nessuna.',
      takeaway: 'Una transazione è «tutto o niente»: se un passo fallisce, tutto viene annullato (rollback).',
      actors: [
        box('a', 'Conto A', 14, 40, { w: 20, body: '500 €' }),
        box('b', 'Conto B', 86, 40, { w: 20, body: '200 €' }),
        code(
          'sql',
          'SQL',
          'BEGIN;\nUPDATE conti SET saldo = saldo - 100\n  WHERE id = "A";\nUPDATE conti SET saldo = saldo + 100\n  WHERE id = "B";\nCOMMIT;',
          50,
          74,
          { w: 54, from: 1 },
        ),
        box('ok', 'COMMIT', 34, 14, { w: 20, from: 3, body: 'tutto confermato', mark: 'ok' }),
        box('ko', 'ROLLBACK', 66, 14, { w: 20, from: 4, body: 'tutto annullato', mark: 'no' }),
      ],
      links: [['a', 'b']],
      frames: [
        frame('Vogliamo spostare 100 euro dal conto A al conto B.', { hot: ['a', 'b'] }),
        frame('In SQL sono due modifiche: togliere da A e aggiungere a B.', { hot: ['sql'] }),
        frame('Se tutto va bene i soldi si spostano.', {
          hot: ['a', 'b'],
          flows: [['a', 'b', '100 €']],
          set: { a: { body: '400 €' }, b: { body: '300 €' } },
        }),
        frame('Si conferma con COMMIT: entrambe le modifiche diventano definitive.', { hot: ['ok'] }),
        frame(
          'Se la seconda modifica fallisse, senza transazione i 100 euro sparirebbero. Con la transazione, ROLLBACK riporta tutto com’era.',
          {
            hot: ['ko'],
            set: { a: { body: '500 €' }, b: { body: '200 €' } },
          },
        ),
      ],
    }),
    scene({
      id: 'agente-db',
      label: 'Un agente e il database',
      description:
        'Due modi di dare a un agente l’accesso ai dati, e un risultato vuoto che non è un errore.',
      takeaway:
        'Accesso con il minimo privilegio, query parametrizzate, pochi risultati. «Nessun risultato» (vuoto) è diverso da «errore».',
      actors: [
        box('wide', 'Accesso totale', 24, 16, { w: 34, body: 'scrive, cancella, legge tutto', mark: 'no' }),
        box('min', 'Accesso minimo', 76, 16, {
          w: 34,
          from: 1,
          body: 'solo lettura, solo le tabelle utili',
          mark: 'ok',
        }),
        code(
          'param',
          'Query parametrizzata',
          'SELECT * FROM ordini\n WHERE cliente_id = ?\n LIMIT 10',
          26,
          56,
          { w: 42, from: 2 },
        ),
        box('empty', 'Nessun risultato', 76, 54, {
          w: 34,
          from: 3,
          body: 'la query è giusta,\nnon c’è nulla da trovare',
        }),
        box('err', 'Errore', 76, 82, {
          w: 34,
          from: 4,
          body: 'la query non è partita\n(database giù)',
          mark: 'no',
        }),
      ],
      frames: [
        frame('Dare all’agente accesso completo è comodo, ma un errore può cancellare dati.', {
          hot: ['wide'],
        }),
        frame('Meglio il minimo: solo lettura e solo ciò che serve.', { hot: ['min'] }),
        frame('Le query usano parametri, non testo incollato dall’utente, e limitano i risultati.', {
          hot: ['param'],
        }),
        frame('Se la query non trova nulla è un’informazione: «non ci sono ordini».', { hot: ['empty'] }),
        frame('Se il database non risponde è un errore: l’agente non deve dire che non ci sono dati.', {
          hot: ['err'],
        }),
      ],
    }),
    scene({
      id: 'pii',
      label: 'Dati personali',
      description:
        'Prima di mandare un testo a un modello, si può nascondere ciò che identifica una persona.',
      takeaway:
        'Mascherare i dati personali (PII) prima dell’invio: il modello vede ciò che serve per il compito, non di più.',
      actors: [
        code(
          'raw',
          'Testo originale',
          'Mario Rossi, mario@email.it,\nIBAN IT60X…, ha chiesto un rimborso',
          22,
          26,
          { w: 38 },
        ),
        box('mask', 'Mascheramento', 56, 26, { w: 22, from: 1, body: 'codice, non il modello' }),
        code('safe', 'Testo inviato', '[CLIENTE_1], [EMAIL_1],\n[IBAN_1], ha chiesto un rimborso', 80, 56, {
          w: 36,
          from: 2,
        }),
        box('model', 'Modello', 80, 86, { w: 22, from: 3, body: 'lavora sul compito' }),
      ],
      links: [
        ['raw', 'mask'],
        ['mask', 'safe'],
        ['safe', 'model'],
      ],
      frames: [
        frame('Un testo contiene nome, email e IBAN di un cliente.', { hot: ['raw'] }),
        frame('Un passaggio di codice sostituisce i dati personali con segnaposto.', {
          hot: ['mask'],
          flows: [['raw', 'mask']],
        }),
        frame('Il testo che parte non contiene più dati identificativi.', {
          hot: ['safe'],
          flows: [['mask', 'safe']],
          set: { safe: { mark: 'ok' } },
        }),
        frame('Il modello svolge il compito senza vedere ciò che non gli serve.', {
          hot: ['model'],
          flows: [['safe', 'model']],
        }),
      ],
    }),
  ],
};
