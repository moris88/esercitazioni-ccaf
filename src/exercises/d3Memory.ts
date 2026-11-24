import type { Diagram, Exercise } from '../types';

const diagram: Diagram = {
  nodes: [
    { id: 'memory', label: 'CLAUDE.md', x: 62, y: 40 },
    { id: 'claude', label: 'Claude', x: 258, y: 40 },
    { id: 'rule', label: 'testing.md', x: 62, y: 175 },
    { id: 'file', label: 'File aperto', x: 258, y: 175 },
  ],
  edges: [
    { from: 'memory', to: 'claude' },
    { from: 'claude', to: 'file' },
    { from: 'rule', to: 'claude' },
  ],
};

export const d3Memory: Exercise = {
  id: 'd3-1',
  code: 'D3·1',
  lesson: 'CLAUDE.md e regole',
  title: 'CLAUDE.md e una regola per percorso',
  place: 'Claude Code',
  minutes: 10,
  goal: 'Creare CLAUDE.md, aggiungere una regola con paths e vedere che viene applicata solo ai file giusti.',
  observe: [
    'Il test usa Vitest, describe col nome del componente e nomi che iniziano con «dovrebbe»: la regola è stata applicata.',
    'La regola entra in gioco sui file .test.*, non sulla modifica a format.ts.',
    '/memory mostra la gerarchia: CLAUDE.md di progetto, utente ed eventuali file locali.',
  ],
  exam: 'Regole con paths = una sola fonte per file sparsi; CLAUDE.md di progetto = condiviso.',
  scenes: [
    {
      id: 'init',
      label: '1. /init e regola',
      simulator: 'code',
      source: 'esempio',
      title: 'repo-prova',
      diagram,
      steps: [
        { kind: 'command', text: '/init' },
        {
          kind: 'tool',
          name: 'Write',
          input: 'CLAUDE.md',
          result: '# CLAUDE.md\n## Comandi: npm test, npm run build\n## Struttura: src/components, src/utils',
          status: 'ok',
          path: ['memory', 'claude'],
          note: 'Uno scheletro: va riletto e corretto prima di condividerlo.',
        },
        { kind: 'command', text: '!cp ../kit/claude-code/rules/testing.md .claude/rules/' },
        {
          kind: 'output',
          text: 'paths:\n  - "**/*.test.ts"\n  - "**/*.test.tsx"\n\nOgni test ha un nome in italiano che inizia con "dovrebbe".',
          tone: 'info',
          path: ['rule'],
          note: 'paths decide per quali file viene caricata la regola.',
        },
      ],
    },
    {
      id: 'applicazione',
      label: '2. Dove si applica',
      simulator: 'code',
      source: 'esempio',
      title: 'repo-prova',
      diagram,
      steps: [
        { kind: 'message', role: 'user', text: 'Scrivi un test per src/components/Button.tsx' },
        {
          kind: 'tool',
          name: 'Read',
          input: 'src/components/Header.test.tsx',
          result: 'Caricata la regola .claude/rules/testing.md',
          status: 'ok',
          path: ['rule', 'claude', 'file'],
          note: 'Claude tocca un file che corrisponde a paths: la regola entra nel contesto.',
        },
        {
          kind: 'tool',
          name: 'Write',
          input: 'src/components/Button.test.tsx',
          result:
            "describe('Button', () => {\n  it('dovrebbe chiamare onClick al clic', …);\n  it('dovrebbe mostrare il contenuto', …);\n});",
          status: 'ok',
          observe: [0],
        },
        {
          kind: 'message',
          role: 'user',
          text: 'Aggiungi un commento JSDoc alla funzione principale di src/utils/format.ts',
        },
        {
          kind: 'tool',
          name: 'Edit',
          input: 'src/utils/format.ts',
          result: '/** Formatta un importo in euro. */',
          status: 'ok',
          path: ['memory', 'claude', 'file'],
          observe: [1],
          note: 'format.ts non corrisponde ai percorsi: per questo file la regola non viene caricata.',
        },
        { kind: 'command', text: '/memory' },
        {
          kind: 'output',
          text: 'Memoria utente     ~/.claude/CLAUDE.md\nMemoria progetto   ./CLAUDE.md',
          tone: 'muted',
          path: ['memory', 'claude'],
          observe: [2],
        },
      ],
    },
  ],
};
