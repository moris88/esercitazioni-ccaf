import type { Exercise } from '../types';

const FACTS = `FATTI DEL CASO (non riassumere)
- Cliente: Jane Doe, ID 12345, jane@example.com
- Ordine: A-67890 del 2026-10-15, totale 149,99 euro
- Problema: prodotto arrivato danneggiato (foto ricevute il 2026-10-18)
- Richiesta: rimborso completo di 149,99 euro
- Limite di rimborso automatico: 100,00 euro`;
const QUESTION = 'Qual è il totale esatto dell’ordine e il limite di rimborso automatico?';

export const d5Context: Exercise = {
  id: 'd5-1',
  code: 'D5·1',
  lesson: 'Gestire il contesto',
  title: 'Contesto, compattazione e fatti del caso',
  place: 'Claude Code',
  minutes: 8,
  goal: 'Vedere quanto contesto si usa, compattare in modo guidato e proteggere i dati esatti con un blocco dei fatti.',
  observe: [
    'La lettura diretta di molti file fa crescere il contesto; con Explore entra solo il riepilogo.',
    'Dopo /compact i numeri esatti (149,99 e 100,00) restano solo se li avete protetti.',
    'Il blocco dei fatti funziona meglio se sta anche in un file (scratchpad o CLAUDE.md).',
  ],
  exam: 'I riassunti perdono i numeri: blocco dei fatti del caso; Explore per le esplorazioni prolisse.',
  scenes: [
    {
      id: 'lettura',
      label: '1. Lettura diretta o Explore',
      simulator: 'code',
      source: 'esempio',
      title: 'progetto con molti componenti',
      panes: ['Lettura diretta', 'Subagente Explore'],
      steps: [
        { kind: 'meter', label: '/context', percent: 12, pane: 0 },
        {
          kind: 'message',
          role: 'user',
          pane: 0,
          text: 'Leggi tutti i file in src/components e riassumi cosa fanno.',
        },
        {
          kind: 'tool',
          name: 'Read',
          input: '42 file',
          result: 'contenuti nel contesto',
          status: 'ok',
          pane: 0,
        },
        {
          kind: 'meter',
          label: '/context',
          percent: 58,
          pane: 0,
          note: 'Tutti i file letti restano nella conversazione principale.',
        },
        { kind: 'meter', label: '/context', percent: 12, pane: 1 },
        {
          kind: 'message',
          role: 'user',
          pane: 1,
          text: 'Usa un subagente Explore per riassumere cosa fanno i file in src/components: voglio solo il riepilogo.',
        },
        {
          kind: 'tool',
          name: 'Agent',
          input: 'Explore',
          result: 'riepilogo di 20 righe',
          status: 'ok',
          pane: 1,
        },
        {
          kind: 'meter',
          label: '/context',
          percent: 15,
          pane: 1,
          observe: [0],
          note: 'I file sono stati letti nel contesto del subagente. Percentuali di esempio.',
        },
      ],
    },
    {
      id: 'compact',
      label: '2. Compattare',
      simulator: 'code',
      source: 'esempio',
      title: 'stesso caso, due compattazioni',
      panes: ['/compact semplice', '/compact guidato'],
      steps: [
        { kind: 'message', role: 'user', text: FACTS, pane: 0 },
        { kind: 'command', text: '/compact', pane: 0 },
        {
          kind: 'output',
          text: 'Riassunto: la cliente chiede un rimborso per un prodotto danneggiato, sopra il limite automatico.',
          tone: 'muted',
          pane: 0,
        },
        { kind: 'message', role: 'user', text: QUESTION, pane: 0 },
        {
          kind: 'message',
          role: 'assistant',
          text: 'Il riassunto dice solo che il rimborso supera il limite: non ho più gli importi esatti.',
          pane: 0,
          note: 'Il senso è rimasto, i numeri no. Con un caso così breve può anche andare bene: non è garantito.',
        },
        { kind: 'message', role: 'user', text: FACTS, pane: 1 },
        { kind: 'command', text: '/compact Conserva alla lettera il blocco FATTI DEL CASO.', pane: 1 },
        { kind: 'output', text: FACTS, tone: 'info', pane: 1 },
        { kind: 'message', role: 'user', text: QUESTION, pane: 1 },
        {
          kind: 'message',
          role: 'assistant',
          text: 'Totale dell’ordine: 149,99 euro. Limite di rimborso automatico: 100,00 euro.',
          pane: 1,
          observe: [1, 2],
          note: 'Per i dati che contano tenete una copia in un file: si può sempre rileggere.',
        },
      ],
    },
  ],
};
