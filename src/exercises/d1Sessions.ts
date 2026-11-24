import type { Diagram, Exercise } from '../types';

const diagram: Diagram = {
  nodes: [
    { id: 'base', label: 'Sessione', x: 62, y: 40 },
    { id: 'resume', label: 'Ripresa', x: 258, y: 40 },
    { id: 'fork', label: 'Fork', x: 258, y: 175 },
    { id: 'file', label: 'Button.tsx', x: 62, y: 175 },
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
      simulator: 'code',
      source: 'esempio',
      title: 'repo-prova',
      diagram,
      steps: [
        { kind: 'message', role: 'user', text: 'Spiegami in 3 punti cosa fa src/components/Button.tsx' },
        {
          kind: 'tool',
          name: 'Read',
          input: 'src/components/Button.tsx',
          result: '18 righe lette',
          status: 'ok',
          path: ['file', 'base'],
        },
        {
          kind: 'message',
          role: 'assistant',
          text: '1. Mostra un pulsante con il contenuto ricevuto.\n2. Sceglie il colore con la prop variant.\n3. Chiama onClick al clic.',
        },
        { kind: 'divider', text: 'Fuori da Claude: la prop variant diventa tone' },
        { kind: 'output', text: "- variant = 'primary'\n+ tone = 'primary'", tone: 'info', path: ['file'] },
        { kind: 'divider', text: 'claude --resume' },
        {
          kind: 'message',
          role: 'user',
          text: 'Quali props accetta Button?',
          path: ['base', 'resume'],
        },
        {
          kind: 'message',
          role: 'assistant',
          text: 'Button accetta children, variant e onClick.',
          observe: [0],
          note: 'Nessuna lettura: risponde con ciò che ha nel contesto. Può anche capitare che rilegga da solo.',
        },
        {
          kind: 'message',
          role: 'user',
          text: 'Ho rinominato la prop variant in tone in Button.tsx: rileggi il file e aggiorna la spiegazione.',
        },
        {
          kind: 'tool',
          name: 'Read',
          input: 'src/components/Button.tsx',
          result: '18 righe lette',
          status: 'ok',
          path: ['file', 'resume'],
        },
        {
          kind: 'message',
          role: 'assistant',
          text: 'Ora Button accetta children, tone e onClick: il colore dipende da tone.',
          observe: [1],
        },
      ],
    },
    {
      id: 'fork',
      label: '2. Fork',
      simulator: 'terminal',
      source: 'esempio',
      title: 'repo-prova',
      diagram,
      panes: ['Sessione originale', 'Fork'],
      steps: [
        { kind: 'command', text: 'claude --resume', path: ['base', 'resume'] },
        { kind: 'output', text: 'ID sessione: 7f3a…', tone: 'muted' },
        {
          kind: 'command',
          text: 'claude --resume --fork-session',
          pane: 1,
          path: ['resume', 'fork'],
        },
        {
          kind: 'output',
          text: 'ID sessione: c91e…  (nuovo)\nCronologia: stessa base',
          tone: 'info',
          pane: 1,
          observe: [2],
          note: 'Stessa storia fino a qui, poi due strade indipendenti.',
        },
        { kind: 'output', text: '> Prova con una mappa di colori', pane: 1 },
        {
          kind: 'output',
          text: '(nessun cambiamento nella cronologia)',
          tone: 'muted',
          note: 'Il fork separa la conversazione, non i file: entrambe lavorano sulla stessa cartella.',
        },
      ],
    },
  ],
};
