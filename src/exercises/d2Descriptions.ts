import type { Exercise } from '../types';

const REQUESTS = `Richieste:
1. Il cliente ha scritto: "Terzo ritardo in un mese, sono davvero stufo". Come si sente?
2. Fattura 2026-118, Acme Srl, 3 x Widget a 40 euro. Quanto è il totale?
3. Recensione: "Prodotto ok, consegna lenta". È soddisfatto?
4. Ricevuta del bar: 2 caffè 2,40 euro. Estrai l'importo.

Rispondi con una tabella: richiesta, strumento scelto, quanto sei sicuro da 0 a 100.`;
const INTRO =
  'Hai solo questi due strumenti. Per ogni richiesta dimmi quale useresti, basandoti soltanto sulla descrizione.';

export const VAGUE_PROMPT = `${INTRO}
- analyze_content: Analizza i contenuti per ricavarne informazioni
- analyze_document: Analizza un documento per ricavarne informazioni

${REQUESTS}`;

export const CLEAR_PROMPT = `${INTRO}
- analizza_sentiment: valuta il tono di un messaggio breve di un cliente. NON usarlo per estrarre dati da documenti.
- estrai_dati_fattura: estrae fornitore, righe e totale da una fattura o ricevuta. NON usarlo per valutare il tono.

${REQUESTS}`;

export const REWRITE_PROMPT = `Riscrivi la descrizione di questo strumento includendo scopo, formato di input con un esempio, output, casi limite e quando usarlo invece di uno strumento simile:

nome: search
descrizione: Cerca elementi`;

export const d2Descriptions: Exercise = {
  id: 'd2-1',
  code: 'D2·1',
  lesson: 'Progettare gli strumenti',
  title: 'Descrizioni vaghe contro descrizioni chiare',
  place: 'Claude (app o claude.ai)',
  minutes: 8,
  goal: 'Misurare quanto la descrizione guida la scelta dello strumento.',
  observe: [
    'Con le descrizioni vaghe Claude è poco sicuro: nella prova registrata da 60 a 75 su 100, e dice che sono quasi identiche.',
    'Con le descrizioni chiare la sicurezza sale: nella prova registrata da 88 a 98.',
    'La descrizione riscritta dice anche quando NON usare lo strumento.',
  ],
  exam: 'La description è il criterio di selezione; strumenti sovrapposti causano errori di instradamento.',
  scenes: [
    {
      id: 'confronto',
      label: '1. Le stesse richieste',
      description:
        'Due chat con le stesse quattro richieste. Cambia solo come sono descritti gli strumenti: a sinistra in modo vago, a destra in modo chiaro. Confrontate la colonna della sicurezza.',
      simulator: 'chat',
      source: 'reale',
      title: 'risposte registrate con claude -p · modello sonnet',
      panes: ['Descrizioni vaghe', 'Descrizioni chiare'],
      steps: [
        { kind: 'message', role: 'user', pane: 0, text: VAGUE_PROMPT },
        {
          kind: 'table',
          pane: 0,
          columns: ['N.', 'Strumento scelto', 'Sicurezza'],
          rows: [
            ['1', 'analyze_content', '60'],
            ['2', 'analyze_document', '75'],
            ['3', 'analyze_content', '60'],
            ['4', 'analyze_document', '65'],
          ],
        },
        {
          kind: 'message',
          role: 'assistant',
          pane: 0,
          text: '[…] le due descrizioni sono quasi identiche, quindi la scelta si basa solo sulla natura dell’input. […] "contenuti" è un termine generico che potrebbe includere anche i documenti. […]',
          observe: [0],
          note: 'Le scelte sono sensate, ma Claude si basa sulla richiesta: le descrizioni non lo aiutano.',
        },
        { kind: 'message', role: 'user', pane: 1, text: CLEAR_PROMPT },
        {
          kind: 'table',
          pane: 1,
          columns: ['N.', 'Strumento scelto', 'Sicurezza'],
          rows: [
            ['1', 'analizza_sentiment', '98'],
            ['2', 'estrai_dati_fattura', '93'],
            ['3', 'analizza_sentiment', '88'],
            ['4', 'estrai_dati_fattura', '95'],
          ],
          observe: [1],
          note: 'La sicurezza è dichiarata dal modello: serve per confrontare, non è una misura calibrata.',
        },
      ],
    },
    {
      id: 'riscrittura',
      label: '2. Riscrivere la descrizione',
      description:
        'Una chat in cui si chiede a Claude di trasformare una descrizione di due parole in una completa. La tabella mostra i cinque elementi che mancavano.',
      simulator: 'chat',
      source: 'esempio',
      title: 'nuova chat',
      steps: [
        { kind: 'message', role: 'user', text: REWRITE_PROMPT },
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
