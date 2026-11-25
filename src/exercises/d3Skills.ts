import type { Exercise } from '../types';

export const d3Skills: Exercise = {
  id: 'd3-2',
  code: 'D3·2',
  lesson: 'Skill, plan mode e subagenti',
  title: 'Una skill, il plan mode e un subagente personalizzato',
  place: 'Claude Code',
  minutes: 10,
  goal: 'Usare una skill, provare il plan mode su una modifica ampia e usare un subagente in sola lettura.',
  observe: [
    'La skill parte anche senza /, perché la description descrive quando usarla.',
    'In plan mode Claude esplora e propone un piano, ma non modifica nulla finché non approvate.',
    'Il revisore ha solo Read, Grep e Glob: non può modificare i file.',
  ],
  exam: 'description = invocazione automatica; plan mode per molti file; strumenti limitati per i subagenti.',
  scenes: [
    {
      id: 'skill',
      label: '1. Skill',
      description:
        'Una domanda normale, senza comandi. Claude riconosce da solo che c’è una skill adatta, la carica e risponde seguendo i suoi cinque punti.',
      simulator: 'code',
      source: 'reale',
      title: 'cartella-prova · modello sonnet',
      steps: [
        { kind: 'message', role: 'user', text: 'Come funziona la procedura sulle garanzie?' },
        {
          kind: 'tool',
          name: 'Skill',
          input: 'spiega-procedura',
          result: 'Launching skill: spiega-procedura',
          status: 'ok',
          observe: [0],
          note: 'Nessuna barra: la domanda corrisponde alla description della skill.',
        },
        { kind: 'tool', name: 'Read', input: 'procedure\\garanzie.md', status: 'ok' },
        {
          kind: 'message',
          role: 'assistant',
          text: '1. A cosa serve\nFissa la durata della garanzia sui prodotti […]\n2. Chi la segue\nNon è indicato nessun responsabile. […]\n3. I passaggi […]\n4. Documenti collegati […]\n5. Dubbio e contraddizione da segnalare\ngaranzie.md dà 30 giorni dalla consegna per i prodotti danneggiati. rimborsi.md dà 14 giorni dalla consegna. […]',
          note: 'I cinque punti arrivano da SKILL.md.',
        },
      ],
    },
    {
      id: 'plan',
      label: '2. Plan mode',
      description:
        'In plan mode Claude può leggere ma non modificare. Alla richiesta di cambiare molti documenti risponde con un piano, e aspetta l’approvazione.',
      simulator: 'code',
      source: 'esempio',
      title: 'cartella-prova · plan mode',
      steps: [
        { kind: 'output', text: '⏸ plan mode attivo (Shift+Tab)', tone: 'info' },
        {
          kind: 'message',
          role: 'user',
          text: 'In tutte le procedure sostituisci la parola "cliente" con "acquirente" e aggiungi il responsabile dove manca.',
        },
        {
          kind: 'tool',
          name: 'Grep',
          input: 'cliente in procedure',
          result: 'garanzie.md\nrimborsi.md',
          status: 'ok',
        },
        {
          kind: 'message',
          role: 'assistant',
          text: 'Piano:\n1. Sostituire la parola in garanzie.md e rimborsi.md.\n2. Aggiungere il responsabile in garanzie.md e Archivio-listino-2023.md.\nDa chiarire: chi è il responsabile?',
        },
        {
          kind: 'permission',
          question: 'Approvi il piano?',
          options: ['Sì, procedi', 'No, continua a pianificare'],
          choice: 1,
          observe: [1],
          note: 'Solo letture finora: nessun file è cambiato.',
        },
      ],
    },
    {
      id: 'revisore',
      label: '3. Subagente revisore',
      description:
        'Claude affida la revisione a un subagente che può solo leggere. La tabella riporta i problemi trovati nei due documenti, senza nessuna modifica.',
      simulator: 'code',
      source: 'reale',
      title: 'cartella-prova · modello sonnet',
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: 'Usa revisore-documenti per rivedere rimborsi.md e garanzie.md nella cartella procedure. Riporta i problemi in tabella.',
        },
        {
          kind: 'tool',
          name: 'Agent',
          input: 'revisore-documenti · Revisione rimborsi e garanzie',
          status: 'ok',
          observe: [2],
          note: 'Gli strumenti permessi sono scritti nel file del subagente: Read, Grep, Glob.',
        },
        {
          kind: 'table',
          columns: ['Documento', 'Gravità', 'Problema'],
          rows: [
            ['rimborsi.md e garanzie.md', 'Alta', 'contraddizione: 14 giorni contro 30 per i danneggiati'],
            ['garanzie.md, punto 3', 'Media', 'poco chiaro quando vale la foto del danno'],
            ['rimborsi.md, punto 3', 'Media', '«un responsabile» non è identificato'],
          ],
          highlight: [0],
          note: 'Estratto riassunto: i problemi segnalati erano 8. Segnala senza correggere.',
        },
      ],
    },
  ],
};
