import type { Diagram, Exercise } from '../types';

const diagram: Diagram = {
  nodes: [
    { id: 'config', label: '.mcp.json', x: 62, y: 40 },
    { id: 'code', label: 'Claude Code', x: 258, y: 40 },
    { id: 'server', label: 'Server docs', x: 258, y: 175 },
    { id: 'docs', label: 'Guida online', x: 62, y: 175 },
  ],
  edges: [
    { from: 'config', to: 'code' },
    { from: 'code', to: 'server' },
    { from: 'server', to: 'docs' },
  ],
};

export const MCP_COMMAND =
  'claude mcp add --scope project --transport http docs https://code.claude.com/docs/mcp';

export const d2Mcp: Exercise = {
  id: 'd2-3',
  code: 'D2·3',
  lesson: 'MCP e strumenti integrati',
  title: 'Aggiungere un server MCP al progetto',
  place: 'Terminale e Claude Code',
  minutes: 10,
  goal: 'Configurare un server MCP con ambito progetto, vedere il file .mcp.json e usare gli strumenti integrati Grep e Glob.',
  observe: [
    '.mcp.json è nella radice: si condivide con il team insieme al progetto (ambito progetto).',
    'Il server è remoto (http): non si installa nulla. Un server locale sarebbe invece di tipo stdio.',
    'Alla prima apertura Claude Code chiede di approvare i server del progetto.',
    'Glob cerca per nome di file, Grep nel contenuto.',
  ],
  exam: '.mcp.json = ambito progetto; stdio per il locale, http per il remoto; Grep contenuti, Glob nomi.',
  scenes: [
    {
      id: 'configurazione',
      label: '1. Aggiungere il server',
      description:
        'Il terminale, fuori da Claude Code. Un solo comando aggiunge il server della guida ufficiale; sotto si vede il file .mcp.json creato nella cartella.',
      simulator: 'terminal',
      source: 'esempio',
      title: 'cartella-prova',
      diagram,
      steps: [
        { kind: 'command', text: MCP_COMMAND },
        {
          kind: 'output',
          text: 'Server MCP «docs» aggiunto alla configurazione del progetto',
          tone: 'muted',
        },
        {
          kind: 'output',
          text: `.mcp.json
{
  "mcpServers": {
    "docs": { "type": "http", "url": "https://code.claude.com/docs/mcp" }
  }
}`,
          path: ['config'],
          observe: [0, 1],
          note: 'Il file è condiviso: mai scrivere segreti qui dentro.',
        },
      ],
    },
    {
      id: 'uso',
      label: '2. Usare il server',
      description:
        'Claude Code chiede il consenso per il nuovo server, poi lo usa per cercare nella guida. Alla fine si confrontano due strumenti integrati: Glob e Grep.',
      simulator: 'code',
      source: 'esempio',
      title: 'cartella-prova',
      diagram,
      steps: [
        {
          kind: 'permission',
          question: 'Nuovo server MCP trovato in .mcp.json: docs',
          options: ['Usa questo server', 'Continua senza'],
          choice: 0,
          path: ['config', 'code'],
          observe: [2],
          note: 'Un server ricevuto insieme al progetto non parte senza il vostro consenso.',
        },
        { kind: 'command', text: '/mcp' },
        { kind: 'output', text: 'docs · connesso · http', tone: 'info', path: ['code', 'server'] },
        {
          kind: 'message',
          role: 'user',
          text: 'Usa il server docs per spiegarmi in due righe che cos’è un hook.',
        },
        {
          kind: 'tool',
          name: 'mcp__docs__…',
          input: 'hook',
          result: 'Pagine della guida sugli hook',
          status: 'ok',
          path: ['code', 'server', 'docs'],
        },
        {
          kind: 'message',
          role: 'user',
          text: 'Poi usa Glob per trovare i file .md in procedure e Grep per trovare dove compare la parola "rimborso".',
        },
        {
          kind: 'tool',
          name: 'Glob',
          input: 'procedure/*.md',
          result: 'Archivio-listino-2023.md\ngaranzie.md\nrimborsi.md\nspedizioni.md',
          status: 'ok',
          path: ['code'],
        },
        {
          kind: 'tool',
          name: 'Grep',
          input: 'rimborso',
          result: 'procedure/garanzie.md\nprocedure/rimborsi.md',
          status: 'ok',
          observe: [3],
          note: 'Glob guarda i nomi, Grep guarda dentro i file.',
        },
      ],
    },
  ],
};
