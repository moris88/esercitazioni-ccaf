import type { Exercise } from '../types';

export const d4Review: Exercise = {
  id: 'd4-3',
  code: 'D4·3',
  lesson: 'Batch, revisione e cache',
  title: 'Autorevisione contro revisione indipendente',
  place: 'Claude Code',
  minutes: 8,
  goal: 'Confrontare la revisione fatta nella stessa sessione che ha scritto il codice con quella di una sessione nuova.',
  observe: [
    'La prima revisione tende a confermare le scelte fatte: conosce già il perché di ogni decisione.',
    'La sessione nuova parte dai requisiti e trova più facilmente casi limite (input negativi, esattamente 50 euro, codice in minuscolo).',
    'Il risultato può variare da una prova all’altra: è proprio il motivo per separare le sessioni.',
  ],
  exam: 'Bias del contesto di ragionamento: chi genera non revisiona; sessione indipendente.',
  scenes: [
    {
      id: 'scrittura',
      label: '1. Scrivere la funzione',
      simulator: 'code',
      source: 'esempio',
      title: 'sessione 1',
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: 'Scrivi in src/utils/sconto.ts una funzione calcolaSconto(totale, codice) con queste regole: codice BENVENUTO = 10% solo sopra i 50 euro; codice VIP = 20% senza minimi; codici sconosciuti = nessuno sconto; il totale non può mai diventare negativo; arrotonda a 2 decimali.',
        },
        {
          kind: 'tool',
          name: 'Write',
          input: 'src/utils/sconto.ts',
          result: `export function calcolaSconto(totale: number, codice: string): number {
  let sconto = 0;
  if (codice === 'BENVENUTO' && totale > 50) sconto = 0.1;
  if (codice === 'VIP') sconto = 0.2;
  return Math.round(totale * (1 - sconto) * 100) / 100;
}`,
          status: 'ok',
          note: 'Domanda al team: che cosa succede con un totale di -10 o NaN?',
        },
      ],
    },
    {
      id: 'confronto',
      label: '2. Due revisioni',
      simulator: 'code',
      source: 'esempio',
      title: 'stesso codice, due sessioni',
      panes: ['Sessione 1 · chi ha scritto', 'Sessione 2 · indipendente'],
      steps: [
        {
          kind: 'message',
          role: 'user',
          pane: 0,
          text: 'Rivedi il codice che hai scritto e dimmi se ci sono problemi.',
        },
        {
          kind: 'message',
          role: 'assistant',
          pane: 0,
          text: 'Il codice rispetta le regole: BENVENUTO solo sopra i 50 euro, VIP senza minimi, arrotondamento a 2 decimali. Non vedo problemi.',
          observe: [0],
          note: 'Rilegge partendo dalle proprie scelte, quindi tende a confermarle.',
        },
        {
          kind: 'message',
          role: 'user',
          pane: 1,
          text: 'claude -p "Rivedi src/utils/sconto.ts rispetto a questi requisiti e cerca bug e casi limite non gestiti: BENVENUTO 10% solo sopra 50 euro; VIP 20%; codici sconosciuti nessuno sconto; totale mai negativo; 2 decimali; totale negativo o non numerico in input."',
        },
        { kind: 'tool', name: 'Read', input: 'src/utils/sconto.ts', status: 'ok', pane: 1 },
        {
          kind: 'table',
          pane: 1,
          columns: ['Caso', 'Esito'],
          rows: [
            ['totale -10', 'BUG: resta negativo'],
            ['totale NaN', 'BUG: restituisce NaN'],
            ['"vip" minuscolo', 'da chiarire: nessuno sconto'],
            ['esattamente 50', 'corretto: nessuno sconto'],
          ],
          highlight: [0, 1],
          observe: [1],
          note: 'Parte dai requisiti, senza difendere scelte precedenti.',
        },
        {
          kind: 'message',
          role: 'assistant',
          pane: 1,
          text: 'Suggerisco di gestire gli input non validi e aggiungere un test per ciascun caso.',
          observe: [2],
          note: 'Nota: il secondo prompt cita già negativi e NaN. Per un confronto pulito usate gli stessi requisiti.',
        },
      ],
    },
  ],
};
