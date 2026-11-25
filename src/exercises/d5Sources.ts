import type { Exercise } from '../types';

export const d5Sources: Exercise = {
  id: 'd5-3',
  code: 'D5·3',
  lesson: 'Revisione umana e provenienza',
  title: 'Fonti in conflitto e confidenza per campo',
  place: 'Claude (app o claude.ai)',
  minutes: 8,
  goal: 'Ottenere una sintesi che lega ogni dato alla fonte, annota i conflitti e distingue i livelli di certezza.',
  observe: [
    'La sintesi libera rischia di scegliere un valore in silenzio (2,3 oppure 2,28 miliardi).',
    'La versione strutturata riporta entrambi i valori e indica il bilancio revisionato come fonte autorevole.',
    'L’acquisizione è «fonte singola»: un’indiscrezione di un blog.',
    'Domanda al team: queste confidenze sono calibrate? (No: andrebbero verificate su dati etichettati.)',
  ],
  exam: 'Conflitti annotati, non scelti in silenzio; date diverse; confidenza per campo e calibrata.',
  scenes: [
    {
      id: 'fonti',
      label: '1. Le fonti',
      description:
        'Le tre fonti dell’esercizio: due danno cifre diverse per gli stessi ricavi, la terza riporta un’indiscrezione.',
      simulator: 'chat',
      source: 'kit',
      title: 'fonti_conflitto.txt',
      steps: [
        {
          kind: 'table',
          columns: ['Fonte', 'Pubblicata', 'Contenuto'],
          rows: [
            ['1. Comunicato Nordica', '15/01/2026', '2,3 miliardi, +15%. Dati preliminari, non revisionati'],
            ['2. Bilancio depositato', '28/02/2026', '2,28 miliardi, +14,6%. Dati revisionati'],
            ['3. Blog di finanza', '20/01/2026', 'Indiscrezioni su un’acquisizione (raccolto il 10/02/2026)'],
          ],
          note: 'Due cifre diverse per gli stessi ricavi: quale usereste?',
        },
      ],
    },
    {
      id: 'libera',
      label: '2. Sintesi libera',
      description:
        'Una richiesta generica di riassunto. La risposta è scorrevole, ma del disaccordo tra le fonti non resta traccia.',
      simulator: 'chat',
      source: 'esempio',
      title: 'nuova chat',
      steps: [
        {
          kind: 'message',
          role: 'user',
          attachment: 'fonti_conflitto.txt',
          text: 'Riassumi in due righe i ricavi del Q4 2025 di Nordica.',
        },
        {
          kind: 'message',
          role: 'assistant',
          text: 'Nel Q4 2025 Nordica ha registrato ricavi per 2,3 miliardi di euro, in crescita del 15% su base annua.',
          observe: [0],
          note: 'Frase scorrevole, ma il conflitto è sparito e il dato scelto è quello preliminare.',
        },
      ],
    },
    {
      id: 'provenienza',
      label: '3. Con provenienza',
      description:
        'La richiesta ora pretende fonte, data e confidenza. Nei riquadri si vedono entrambi i valori e quale fa fede.',
      simulator: 'chat',
      source: 'esempio',
      title: 'stessa chat',
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: 'Ora restituisci un JSON con: per ogni affermazione claim, fonte, data_pubblicazione, data_raccolta (se nota) e livello: ben documentato, contestato o fonte singola. Se le fonti non concordano, riporta tutti i valori con la loro fonte e indica quale fa fede e perché. Aggiungi una confidenza da 0 a 1 per ogni campo.',
        },
        {
          kind: 'message',
          role: 'assistant',
          text: `\`\`\`json
{
  "claim": "Ricavi Q4 2025",
  "livello": "contestato",
  "valori": [
    { "valore": "2,3 mld", "fonte": "Comunicato", "data_pubblicazione": "2026-01-15", "confidenza": 0.4 },
    { "valore": "2,28 mld", "fonte": "Bilancio", "data_pubblicazione": "2026-02-28", "confidenza": 0.95 }
  ],
  "fa_fede": "Bilancio: dati revisionati e più recenti"
}
\`\`\``,
          observe: [1],
          note: 'Estratto: entrambi i valori restano visibili, con la ragione della scelta.',
        },
        {
          kind: 'message',
          role: 'assistant',
          text: `\`\`\`json
{
  "claim": "Possibile acquisizione nel 2026",
  "livello": "fonte singola",
  "fonte": "Blog di finanza",
  "data_pubblicazione": "2026-01-20",
  "data_raccolta": "2026-02-10",
  "confidenza": 0.2
}
\`\`\``,
          observe: [2],
        },
        {
          kind: 'table',
          columns: ['Dato', 'Confidenza dichiarata', 'Verificata?'],
          rows: [
            ['2,28 mld', '0,95', 'no'],
            ['2,3 mld', '0,40', 'no'],
            ['Acquisizione', '0,20', 'no'],
          ],
          observe: [3],
          note: 'Sono numeri dichiarati dal modello: diventano utili solo dopo averli confrontati con dati etichettati.',
        },
      ],
    },
  ],
};
