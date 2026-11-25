import type { Diagram, Exercise } from '../types';

const diagram: Diagram = {
  nodes: [
    { id: 'invoice', label: 'Fattura', x: 62, y: 40 },
    { id: 'claude', label: 'Claude', x: 258, y: 40 },
    { id: 'schema', label: 'Schema', x: 258, y: 175 },
    { id: 'check', label: 'Codice', x: 62, y: 175 },
  ],
  edges: [
    { from: 'invoice', to: 'claude' },
    { from: 'claude', to: 'schema' },
    { from: 'schema', to: 'check' },
  ],
};

export const INVOICE_PROMPT =
  "Estrai i dati di questa fattura in JSON, seguendo lo schema. totale_calcolato è la somma dei totali di riga. Se un dato non c'è usa null; se lo stato di pagamento non è chiaro usa unclear. Rispondi solo con il JSON.";

export const d4Invoice: Exercise = {
  id: 'd4-2',
  code: 'D4·2',
  lesson: 'Output strutturato e convalida',
  title: 'Estrarre una fattura con uno schema',
  place: 'Claude (app o claude.ai)',
  minutes: 10,
  goal: 'Ottenere un JSON conforme a uno schema e scoprire che la forma giusta non garantisce i dati giusti.',
  observe: [
    'numero_ordine_acquisto è null: il dato non c’è e lo schema non costringe a inventarlo.',
    'stato_pagamento è unclear o «da pagare»: la fattura dice solo «bonifico a 30 giorni».',
    'Le righe sommano 484 euro, l’imponibile dichiarato è 450: lo schema è rispettato ma i dati non tornano.',
    'Domanda al team: dove va il controllo dichiarato contro calcolato? (Nel codice.)',
  ],
  exam: 'Lo schema garantisce la forma, non la correttezza; null e unclear per non inventare.',
  scenes: [
    {
      id: 'fattura',
      label: '1. La fattura',
      description:
        'La fattura da cui estrarre i dati. Provate a sommare le righe e a confrontare il risultato con l’imponibile.',
      simulator: 'chat',
      source: 'kit',
      title: 'kit/dati/fattura.txt (estratto)',
      diagram,
      steps: [
        {
          kind: 'message',
          role: 'assistant',
          text: `\`\`\`
ACME FORNITURE SRL
FATTURA N. 2026/118 del 03/11/2026

Descrizione               Q.tà   Prezzo unit.    Totale
Monitor 27 pollici          2       180,00       360,00
Supporto da scrivania       2        45,00        90,00
Cavo HDMI 2 m               4         8,50        34,00

                              Imponibile         450,00
                              IVA 22%             99,00
                              TOTALE             549,00

Modalità di pagamento: bonifico a 30 giorni.
\`\`\``,
          path: ['invoice'],
          note: 'Domanda al team: che cosa non torna?',
        },
      ],
    },
    {
      id: 'estrazione',
      label: '2. Estrazione',
      description:
        'In chat si allegano fattura e schema. Claude risponde con i dati in forma ordinata: guardate i campi null e unclear.',
      simulator: 'chat',
      source: 'reale',
      title: 'risposta registrata con claude -p · modello sonnet',
      diagram,
      steps: [
        {
          kind: 'message',
          role: 'user',
          attachment: 'fattura.txt e schema_fattura.json',
          text: INVOICE_PROMPT,
          path: ['invoice', 'claude'],
        },
        {
          kind: 'message',
          role: 'assistant',
          text: `\`\`\`json
{
  "fornitore": "ACME FORNITURE SRL",
  "numero_fattura": "2026/118",
  "numero_ordine_acquisto": null,
  "righe": […],
  "totale_dichiarato": 549.00,
  "totale_calcolato": 484.00,
  "stato_pagamento": "unclear"
}
\`\`\``,
          path: ['claude', 'schema'],
          observe: [0, 1],
          note: 'Attenzione: 549 comprende l’IVA, 484 no. Il confronto giusto è 484 contro l’imponibile, 450.',
        },
      ],
    },
    {
      id: 'controllo',
      label: '3. Il controllo nel codice',
      description:
        'Un controllo automatico confronta la somma delle righe con l’imponibile dichiarato e segnala la differenza.',
      simulator: 'terminal',
      source: 'esempio',
      title: 'controllo deterministico',
      diagram,
      steps: [
        { kind: 'output', text: 'Schema: conforme ✓', tone: 'info', path: ['schema'] },
        {
          kind: 'output',
          text: 'somma righe   360 + 90 + 34 = 484,00\nimponibile dichiarato      = 450,00',
          path: ['schema', 'check'],
        },
        {
          kind: 'output',
          text: 'ERRORE: differenza di 34,00 euro → revisione umana',
          tone: 'error',
          observe: [2, 3],
          note: 'La differenza è la riga del cavo HDMI. Lo schema del kit non estrae l’imponibile: andrebbe aggiunto.',
        },
      ],
    },
  ],
};
