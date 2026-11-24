import type { Diagram, Exercise } from '../types';

const diagram: Diagram = {
  nodes: [
    { id: 'config', label: '.mcp.json', x: 62, y: 40 },
    { id: 'code', label: 'Claude Code', x: 258, y: 40 },
    { id: 'server', label: 'Server docs', x: 258, y: 175 },
    { id: 'docs', label: 'docs/', x: 62, y: 175 },
  ],
  edges: [
    { from: 'config', to: 'code' },
    { from: 'code', to: 'server' },
    { from: 'server', to: 'docs' },
  ],
};

export const d2Mcp: Exercise = {
  id: 'd2-3',
  code: 'D2·3',
  lesson: 'MCP e strumenti integrati',
  title: 'Aggiungere un server MCP al progetto',
  place: 'Claude Code',
  minutes: 10,
  goal: 'Configurare un server MCP con ambito progetto, vedere il file .mcp.json e usare gli strumenti integrati Grep e Glob.',
  observe: [
    '.mcp.json è nella radice: va in Git ed è condiviso con il team (ambito progetto).',
    'Il server è stdio: Claude Code lo avvia come processo locale con npx.',
    'Alla prima apertura Claude Code chiede di approvare i server del progetto.',
    'Glob cerca per nome di file, Grep nel contenuto.',
  ],
  exam: '.mcp.json = ambito progetto; stdio per il locale; Grep contenuti, Glob nomi.',
  scenes: [
    {
      id: 'configurazione',
      label: '1. Aggiungere il server',
      simulator: 'terminal',
      source: 'esempio',
      title: 'repo-prova',
      diagram,
      steps: [
        {
          kind: 'command',
          text: 'claude mcp add --scope project docs -- npx -y @modelcontextprotocol/server-filesystem ./docs',
        },
        {
          kind: 'output',
          text: 'Server MCP «docs» aggiunto alla configurazione del progetto',
          tone: 'muted',
        },
        { kind: 'command', text: 'cat .mcp.json' },
        {
          kind: 'output',
          text: `{
  "mcpServers": {
    "docs": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "./docs"],
      "env": {}
    }
  }
}`,
          path: ['config'],
          observe: [0, 1],
          note: 'Va in Git: mai scrivere segreti qui dentro.',
        },
      ],
    },
    {
      id: 'uso',
      label: '2. Usare il server',
      simulator: 'code',
      source: 'esempio',
      title: 'repo-prova',
      diagram,
      steps: [
        {
          kind: 'permission',
          question: 'Nuovo server MCP trovato in .mcp.json: docs',
          options: ['Usa questo server', 'Continua senza'],
          choice: 0,
          path: ['config', 'code'],
          observe: [2],
          note: 'Un server arrivato con git pull non parte senza il vostro consenso.',
        },
        { kind: 'command', text: '/mcp' },
        { kind: 'output', text: 'docs · connesso · stdio', tone: 'info', path: ['code', 'server'] },
        {
          kind: 'message',
          role: 'user',
          text: 'Usa il server docs per elencare i file della cartella docs.',
        },
        {
          kind: 'tool',
          name: 'mcp__docs__list_directory',
          input: 'docs',
          result: 'componenti.md\nguida.md',
          status: 'ok',
          path: ['code', 'server', 'docs'],
        },
        {
          kind: 'message',
          role: 'user',
          text: 'Poi usa Glob per trovare tutti i file *.test.tsx e Grep per trovare dove viene importato Button.',
        },
        {
          kind: 'tool',
          name: 'Glob',
          input: '**/*.test.tsx',
          result: 'src/components/Header.test.tsx',
          status: 'ok',
          path: ['code'],
        },
        {
          kind: 'tool',
          name: 'Grep',
          input: 'import.*Button',
          result: "src/components/Header.tsx:2: import { Button } from './Button';",
          status: 'ok',
          observe: [3],
          note: 'Glob guarda i nomi, Grep guarda dentro i file.',
        },
      ],
    },
  ],
};
