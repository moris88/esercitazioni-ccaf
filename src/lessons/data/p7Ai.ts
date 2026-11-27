import { box, code, frame, meter, note, scene } from '../helpers';
import type { Lesson } from '../types';

export const p7Ai: Lesson = {
  id: 'p7-ia',
  group: 'pre',
  code: 'P·7',
  title: 'OCR, token, allucinazioni, RAG e few-shot',
  lesson: 'Pre-corso · Documenti e IA',
  goal: 'Capire da dove nascono gli errori quando un modello lavora su documenti e conversazioni lunghe.',
  exam: 'null invece di inventare; validazione nel codice; numeri importanti conservati a parte.',
  scenes: [
    scene({
      id: 'ocr-token',
      label: 'Documenti e token',
      description:
        'Una fattura scansionata diventa testo, e il testo si misura in token che riempiono il contesto.',
      takeaway:
        'L’OCR può sbagliare a leggere una scansione; i token riempiono la finestra a ogni turno, quindi una conversazione lunga si appesantisce.',
      actors: [
        box('scan', 'Fattura scansionata', 14, 24, { w: 22, body: 'è un’immagine' }),
        box('ocr', 'OCR', 44, 24, { w: 16, from: 1, body: 'legge i caratteri' }),
        code('txt', 'Testo letto', 'Totale: 1.5O0,00\n(uno zero è una "O")', 80, 24, { w: 34, from: 2 }),
        meter('ctx', 'Contesto', 15, 50, 66, { w: 36, from: 3, body: 'token usati' }),
        note('why', 'Ogni turno', 85, 66, {
          w: 26,
          from: 4,
          body: 'i token di tutta la conversazione si rileggono',
        }),
      ],
      links: [
        ['scan', 'ocr'],
        ['ocr', 'txt'],
      ],
      frames: [
        frame('Una fattura arrivata come scansione è un’immagine, non testo.', { hot: ['scan'] }),
        frame('Un programma di OCR riconosce i caratteri e produce del testo.', {
          hot: ['ocr'],
          flows: [['scan', 'ocr']],
        }),
        frame('L’OCR può sbagliare: qui uno zero è diventato una lettera O. Il testo può essere sporco.', {
          hot: ['txt'],
          flows: [['ocr', 'txt']],
          set: { txt: { mark: 'no' } },
        }),
        frame(
          'Il testo si misura in token, pezzi di parola. Ogni domanda e risposta li aggiunge al contesto.',
          {
            hot: ['ctx'],
            set: { ctx: { value: 40 } },
          },
        ),
        frame('A ogni turno si rilegge tutto: la conversazione cresce e costa sempre di più.', {
          hot: ['ctx', 'why'],
          set: { ctx: { value: 90 } },
        }),
      ],
    }),
    scene({
      id: 'allucinazioni',
      label: 'Allucinazioni',
      description: 'Lo stesso documento, due richieste diverse: una spinge a inventare, l’altra no.',
      takeaway:
        'Se un dato manca, il prompt deve permettere di dire null. Altrimenti il modello può inventare qualcosa di plausibile.',
      actors: [
        code('doc', 'Fattura', 'Fornitore: Acme\nTotale: 150,00\n(nessun numero d’ordine)', 18, 30, {
          w: 30,
        }),
        code('p1', 'Prompt 1', '«Estrai il numero d’ordine»', 56, 18, { w: 30, from: 1 }),
        code('p2', 'Prompt 2', '«Se non c’è, rispondi null»', 56, 66, { w: 30, from: 3 }),
        box('r1', 'Risposta', 88, 18, { w: 18, from: 2, body: 'PO-2024-001', mark: 'no' }),
        box('r2', 'Risposta', 88, 66, { w: 18, from: 4, body: 'null', mark: 'ok' }),
      ],
      links: [
        ['doc', 'p1'],
        ['p1', 'r1'],
        ['doc', 'p2'],
        ['p2', 'r2'],
      ],
      frames: [
        frame('Nel documento non c’è nessun numero d’ordine.', { hot: ['doc'] }),
        frame('Una richiesta secca chiede un numero d’ordine, dando per scontato che ci sia.', {
          hot: ['p1'],
        }),
        frame('Il modello vuole essere utile e ne inventa uno plausibile: è un’allucinazione.', {
          hot: ['r1'],
          flows: [['p1', 'r1']],
        }),
        frame('Una richiesta che ammette l’assenza dà al modello un’uscita onesta.', { hot: ['p2'] }),
        frame('Risposta: null. Un dato mancante dichiarato vale più di un dato inventato.', {
          hot: ['r2'],
          flows: [['p2', 'r2']],
        }),
      ],
    }),
    scene({
      id: 'rag-fewshot',
      label: 'RAG ed esempi',
      description:
        'Due modi di dare al modello ciò che non sa: documenti recuperati al momento ed esempi del risultato voluto.',
      takeaway:
        'RAG: prima si cerca nei documenti, poi si risponde usando ciò che si è trovato. Few-shot: pochi esempi mostrano il formato voluto.',
      actors: [
        box('q', 'Domanda', 12, 22, { w: 18, body: 'sul manuale aziendale' }),
        box('search', 'Ricerca', 38, 22, { w: 18, from: 1, body: 'trova i passaggi\nrilevanti' }),
        code('ctx', 'Passaggi trovati', '«Il reso è possibile\nentro 30 giorni»', 66, 22, { w: 28, from: 2 }),
        box('ans', 'Risposta', 90, 22, { w: 16, from: 3, body: 'basata sui documenti', mark: 'ok' }),
        code(
          'shots',
          'Esempi (few-shot)',
          'Input: "5 gen 2024" → 2024-01-05\nInput: "31/12/23" → 2023-12-31',
          32,
          72,
          { w: 52, from: 4 },
        ),
        box('fmt', 'Il modello imita il formato', 80, 72, { w: 28, from: 5 }),
      ],
      links: [
        ['q', 'search'],
        ['search', 'ctx'],
        ['ctx', 'ans'],
        ['shots', 'fmt'],
      ],
      frames: [
        frame('Il modello non conosce il manuale della tua azienda.', { hot: ['q'] }),
        frame('RAG: prima si cercano nei documenti i passaggi che c’entrano con la domanda.', {
          hot: ['search'],
          flows: [['q', 'search']],
        }),
        frame('I passaggi trovati vengono messi nel prompt insieme alla domanda.', {
          hot: ['ctx'],
          flows: [['search', 'ctx']],
        }),
        frame('Il modello risponde appoggiandosi a quel testo, non alla sua memoria.', {
          hot: ['ans'],
          flows: [['ctx', 'ans']],
        }),
        frame('Few-shot: per ottenere un formato preciso si mostrano due o tre esempi di input e output.', {
          hot: ['shots'],
        }),
        frame('Il modello imita il formato degli esempi, senza bisogno di descriverlo a parole.', {
          hot: ['fmt'],
          flows: [['shots', 'fmt']],
        }),
      ],
    }),
  ],
};
