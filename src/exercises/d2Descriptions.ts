import type { Exercise } from '../types';

export const d2Descriptions: Exercise = {
  id: 'd2-1',
  code: 'D2·1',
  lesson: 'Progettare gli strumenti',
  title: 'Descrizioni vaghe contro descrizioni chiare',
  place: 'Terminale (claude -p)',
  minutes: 8,
  goal: 'Misurare quanto la descrizione guida la scelta dello strumento.',
  observe: [
    'Con le descrizioni vaghe la scelta è poco affidabile: in questa prova fattura e ricevuta non attivano nessuno strumento.',
    'Con le descrizioni chiare ogni richiesta va allo strumento giusto.',
    'La descrizione riscritta dice anche quando NON usare lo strumento.',
  ],
  exam: 'La description è il criterio di selezione; strumenti sovrapposti causano errori di instradamento.',
  scenes: [
    {
      id: 'confronto',
      label: '1. Le stesse richieste',
      simulator: 'terminal',
      source: 'reale',
      title: 'kit/claude-p · modello sonnet',
      steps: [
        { kind: 'command', text: 'CLAUDE_MODEL=sonnet python strumenti_ambigui.py' },
        { kind: 'divider', text: '===== DESCRIZIONI VAGHE' },
        {
          kind: 'output',
          text: 'analyze_content   "Analizza i contenuti per ricavarne informazioni"\nanalyze_document  "Analizza un documento per ricavarne informazioni"',
          tone: 'muted',
          note: 'Domanda al team: voi quale scegliereste per una recensione?',
        },
        {
          kind: 'table',
          columns: ['Richiesta', 'Strumento scelto'],
          rows: [
            ['«Terzo ritardo in un mese…» Come si sente?', 'analyze_content'],
            ['«Fattura 2026-118…» Quanto è il totale?', '(nessuno strumento: risposta testuale)'],
            ['Recensione: è soddisfatto?', 'analyze_content'],
            ['Ricevuta del bar: estrai l’importo', '(nessuno strumento: risposta testuale)'],
          ],
          highlight: [1, 3],
          observe: [0],
          note: 'analyze_document non è mai stato scelto, nemmeno per la fattura. Un’altra prova può dare risultati diversi.',
        },
        { kind: 'divider', text: '===== DESCRIZIONI CHIARE' },
        {
          kind: 'output',
          text: 'analizza_sentiment   tono di un messaggio breve… NON per documenti strutturati\nestrai_dati_fattura  dati di fattura o ricevuta… NON per il tono di un messaggio',
          tone: 'muted',
        },
        {
          kind: 'table',
          columns: ['Richiesta', 'Strumento scelto'],
          rows: [
            ['«Terzo ritardo in un mese…» Come si sente?', 'analizza_sentiment'],
            ['«Fattura 2026-118…» Quanto è il totale?', 'estrai_dati_fattura'],
            ['Recensione: è soddisfatto?', 'analizza_sentiment'],
            ['Ricevuta del bar: estrai l’importo', 'estrai_dati_fattura'],
          ],
          observe: [1],
        },
      ],
    },
    {
      id: 'riscrittura',
      label: '2. Riscrivere la descrizione',
      simulator: 'chat',
      source: 'esempio',
      title: 'nuova chat',
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: `Riscrivi la descrizione di questo strumento includendo scopo, formato di input con un esempio, output, casi limite e quando usarlo invece di uno strumento simile:

{"name": "search", "description": "Cerca elementi"}`,
        },
        {
          kind: 'table',
          columns: ['Elemento', 'Nuova descrizione'],
          rows: [
            ['Scopo', 'Cerca prodotti nel catalogo per nome o categoria.'],
            ['Input', 'query: testo libero, es. "monitor 27 pollici".'],
            ['Output', 'Fino a 10 prodotti con ID, nome e prezzo.'],
            ['Casi limite', 'Nessun risultato: lista vuota. Query vuota: errore di validazione.'],
            ['Quando NON usarlo', 'Se hai già l’ID di un ordine usa get_order.'],
          ],
          highlight: [4],
          observe: [2],
          note: 'Il catalogo è un’ipotesi: «Cerca elementi» non dice nemmeno che cosa si cerca.',
        },
      ],
    },
  ],
};
