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

export const d4Invoice: Exercise = {
  id: 'd4-2',
  code: 'D4·2',
  lesson: 'Output strutturato e convalida',
  title: 'Estrarre una fattura con uno schema',
  place: 'Claude Code da terminale (o una chat)',
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
      simulator: 'terminal',
      source: 'kit',
      title: 'kit/dati/fattura.txt (estratto)',
      diagram,
      steps: [
        { kind: 'command', text: 'cat ../kit/dati/fattura.txt' },
        {
          kind: 'output',
          text: `ACME FORNITURE SRL
FATTURA N. 2026/118 del 03/11/2026

Descrizione               Q.tà   Prezzo unit.    Totale
Monitor 27 pollici          2       180,00       360,00
Supporto da scrivania       2        45,00        90,00
Cavo HDMI 2 m               4         8,50        34,00

                              Imponibile         450,00
                              IVA 22%             99,00
                              TOTALE             549,00

Modalità di pagamento: bonifico a 30 giorni.`,
          path: ['invoice'],
          note: 'Domanda al team: che cosa non torna?',
        },
      ],
    },
    {
      id: 'estrazione',
      label: '2. Estrazione',
      simulator: 'terminal',
      source: 'reale',
      title: 'campo structured_output',
      diagram,
      steps: [
        {
          kind: 'command',
          text: 'cat ../kit/dati/fattura.txt | claude -p "Estrai i dati di questa fattura. totale_calcolato è la somma dei totali di riga. Se un dato non c\'è usa null; se lo stato di pagamento non è chiaro usa unclear." --output-format json --json-schema "$(cat ../kit/claude-code/ci/schema_fattura.json)" --model sonnet --no-session-persistence',
          path: ['invoice', 'claude'],
        },
        {
          kind: 'output',
          text: '"fornitore": "ACME FORNITURE SRL",\n"numero_fattura": "2026/118",\n"numero_ordine_acquisto": null,',
          path: ['claude', 'schema'],
          observe: [0],
        },
        {
          kind: 'output',
          text: `"righe": [
  {"descrizione": "Monitor 27 pollici", "quantita": 2, "prezzo_unitario": 180, "totale_riga": 360},
  {"descrizione": "Supporto da scrivania", "quantita": 2, "prezzo_unitario": 45, "totale_riga": 90},
  {"descrizione": "Cavo HDMI 2 m", "quantita": 4, "prezzo_unitario": 8.5, "totale_riga": 34}
],`,
          tone: 'muted',
        },
        {
          kind: 'output',
          text: '"totale_dichiarato": 549,\n"totale_calcolato": 484,\n"stato_pagamento": "unclear"',
          observe: [1],
          note: 'Attenzione: 549 comprende l’IVA, 484 no. Il confronto giusto è 484 contro l’imponibile, 450.',
        },
      ],
    },
    {
      id: 'controllo',
      label: '3. Il controllo nel codice',
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
