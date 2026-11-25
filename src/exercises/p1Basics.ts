import type { Exercise } from '../types';

export const p1Basics: Exercise = {
  id: 'p-1',
  code: 'P·1',
  lesson: 'Pre-corso · Prerequisiti tecnici',
  title: 'JSON, schema e regex con Claude',
  place: 'Claude (app o claude.ai)',
  minutes: 8,
  goal: 'Toccare con mano tre basi del pre-corso: un JSON non valido, uno schema che descrive la forma e la differenza tra un controllo deterministico (regex) e uno del modello.',
  observe: [
    'Chiavi senza virgolette, virgola finale e True maiuscolo: errori tipici che rompono il parsing.',
    'Lo schema usa type, properties, required ed enum: garantisce la forma, non la correttezza.',
    'La regex accetta il 31 febbraio: controlla la forma, non il significato.',
  ],
  exam: 'Schema ≠ correttezza; deterministico (regex, codice) contro probabilistico (modello).',
  scenes: [
    {
      id: 'json',
      label: '1. JSON non valido',
      description:
        'Una chat con Claude. Chi scrive incolla un testo in formato JSON con tre errori; la tabella indica dove sono, senza correggerli.',
      simulator: 'chat',
      source: 'esempio',
      title: 'nuova chat',
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: `Trova gli errori in questo JSON, senza correggerlo:
{
  nome: "Mario Rossi",
  "eta": 42,
  "ordini": ["A-101", "A-102",],
  "premium": True
}`,
          note: 'Domanda al team: quanti errori vedete?',
        },
        { kind: 'message', role: 'assistant', text: 'Ci sono tre errori:' },
        {
          kind: 'table',
          columns: ['Punto', 'Errore'],
          rows: [
            ['nome:', 'la chiave non è tra virgolette doppie'],
            ['"A-102",]', 'virgola finale non ammessa'],
            ['True', 'il booleano si scrive minuscolo: true'],
          ],
          observe: [0],
        },
      ],
    },
    {
      id: 'schema',
      label: '2. JSON Schema',
      description:
        'Si chiede a Claude uno schema, cioè l’elenco delle regole che un ordine deve rispettare. Il riquadro della risposta dice quali campi servono e di che tipo.',
      simulator: 'chat',
      source: 'esempio',
      title: 'stessa chat',
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: 'Scrivi un JSON Schema per un ordine con: id (stringa, obbligatorio), totale (numero, obbligatorio), stato (solo: nuovo, spedito, consegnato) e note (facoltativo, può essere null).',
        },
        {
          kind: 'message',
          role: 'assistant',
          text: `\`\`\`json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "totale": { "type": "number" },
    "stato": { "type": "string", "enum": ["nuovo", "spedito", "consegnato"] },
    "note": { "type": ["string", "null"] }
  },
  "required": ["id", "totale"]
}
\`\`\``,
          observe: [1],
          note: 'Un totale di -5 è valido per questo schema: la forma è giusta, il dato no.',
        },
      ],
    },
    {
      id: 'regex',
      label: '3. Regex e limite',
      description:
        'Claude scrive una regex, cioè un modello che riconosce le date. Poi spiega perché accetta anche una data che non esiste.',
      simulator: 'chat',
      source: 'esempio',
      title: 'stessa chat',
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: 'Dammi una regex per riconoscere date nel formato GG/MM/AAAA. Poi dimmi se la regex accetta 31/02/2026 e perché questo conta.',
        },
        {
          kind: 'message',
          role: 'assistant',
          text: `\`\`\`regex
^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}$
\`\`\`

Sì, accetta 31/02/2026: controlla separatamente giorno e mese, ma non sa quanti giorni ha febbraio. Per la validità reale serve del codice che conosca il calendario.`,
          observe: [2],
          note: 'La regex dà sempre lo stesso esito: è deterministica, ma controlla solo la forma.',
        },
      ],
    },
  ],
};
