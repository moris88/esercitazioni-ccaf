import type { Diagram, Exercise } from '../types';

const diagram: Diagram = {
  nodes: [
    { id: 'base', label: 'Sessione', x: 62, y: 40 },
    { id: 'resume', label: 'Ripresa', x: 258, y: 40 },
    { id: 'fork', label: 'Fork', x: 258, y: 175 },
    { id: 'file', label: 'rimborsi.md', x: 62, y: 175 },
  ],
  edges: [
    { from: 'file', to: 'base' },
    { from: 'base', to: 'resume' },
    { from: 'resume', to: 'fork' },
    { from: 'file', to: 'resume' },
  ],
};

export const d1Sessions: Exercise = {
  id: 'd1-4',
  code: 'D1·4',
  lesson: 'Scomposizione e sessioni',
  title: 'Riprendere, aggiornare e ramificare una sessione',
  place: 'Claude Code',
  minutes: 8,
  goal: 'Vedere che una sessione ripresa non si accorge delle modifiche ai file e provare un fork della sessione.',
  observe: [
    'Se risponde senza rileggere il file, usa informazioni vecchie: la sessione non rileva le modifiche da sola.',
    'Dicendo cosa è cambiato, rilegge e corregge.',
    'Il fork parte dalla stessa base con un nuovo ID: la sessione originale resta com’era.',
  ],
  exam: 'Risultati ancora validi: --resume; file cambiati: dillo esplicitamente o riparti con un riepilogo.',
  scenes: [
    {
      id: 'ripresa',
      label: '1. Riprendere e aggiornare',
      description:
        'Claude spiega una procedura; poi, fuori da Claude, il file viene modificato a mano. Alla ripresa della sessione la prima risposta usa ancora il dato vecchio.',
      simulator: 'code',
      source: 'reale',
      title: 'cartella-prova · modello sonnet',
      diagram,
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: 'Spiegami in 3 punti cosa prevede procedure/rimborsi.md',
        },
        {
          kind: 'tool',
          name: 'Read',
          input: 'procedure\\rimborsi.md',
          status: 'ok',
          path: ['file', 'base'],
        },
        {
          kind: 'message',
          role: 'assistant',
          text: '[…]\n1. Termine: il cliente può chiedere il rimborso entro 14 giorni dalla consegna.\n2. Fino a 100 euro: il rimborso è automatico.\n3. Sopra i 100 euro: serve l’approvazione di un responsabile. […]',
        },
        { kind: 'divider', text: 'Fuori da Claude: 14 giorni diventano 20', path: ['file'] },
        { kind: 'divider', text: 'claude --resume' },
        {
          kind: 'message',
          role: 'user',
          text: 'Entro quanti giorni si può chiedere il rimborso?',
          path: ['base', 'resume'],
        },
        {
          kind: 'message',
          role: 'assistant',
          text: 'Entro 14 giorni dalla consegna.',
          observe: [0],
          note: 'Nessuna lettura: risponde con ciò che ha nel contesto. Può anche capitare che rilegga da solo.',
        },
        {
          kind: 'message',
          role: 'user',
          text: 'Ho cambiato i giorni in procedure/rimborsi.md: rileggi il file e aggiorna la spiegazione.',
        },
        {
          kind: 'tool',
          name: 'Read',
          input: 'procedure\\rimborsi.md',
          status: 'ok',
          path: ['file', 'resume'],
        },
        {
          kind: 'message',
          role: 'assistant',
          text: 'Ho riletto il file. Il termine ora è di 20 giorni dalla consegna, non più 14. […]',
          observe: [1],
        },
      ],
    },
    {
      id: 'fork',
      label: '2. Fork',
      description:
        'A sinistra la sessione originale, a destra una copia che parte dalla stessa storia. Gli ID sono diversi: ciò che si dice nella copia non arriva all’originale.',
      simulator: 'terminal',
      source: 'reale',
      title: 'cartella-prova · ID abbreviati',
      diagram,
      panes: ['Sessione originale', 'Fork'],
      steps: [
        { kind: 'output', text: 'ID sessione: 3d30df68…', tone: 'muted', path: ['base', 'resume'] },
        {
          kind: 'command',
          text: 'claude --resume --fork-session',
          pane: 1,
          path: ['resume', 'fork'],
        },
        {
          kind: 'output',
          text: 'ID sessione: 87c54b68…  (nuovo)',
          tone: 'info',
          pane: 1,
          observe: [2],
          note: 'Stessa storia fino a qui, poi due strade indipendenti.',
        },
        { kind: 'output', text: '> In una frase: e se volessimo 60 giorni?', pane: 1 },
        {
          kind: 'output',
          text: 'Basterebbe cambiare "20" in "60" al punto 1 di procedure/rimborsi.md […]. Non ho modificato il file.',
          pane: 1,
          note: 'Il fork separa la conversazione, non i file: entrambe lavorano sulla stessa cartella.',
        },
      ],
    },
  ],
};
