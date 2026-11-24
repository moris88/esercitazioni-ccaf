import type { Diagram, Exercise } from '../types';

const diagram: Diagram = {
  nodes: [
    { id: 'claude', label: 'Claude', x: 62, y: 40 },
    { id: 'hook', label: 'Hook', x: 258, y: 40 },
    { id: 'bash', label: 'Esecuzione', x: 258, y: 175 },
    { id: 'stop', label: 'Bloccato', x: 62, y: 175 },
  ],
  edges: [
    { from: 'claude', to: 'hook' },
    { from: 'hook', to: 'bash' },
    { from: 'hook', to: 'stop' },
    { from: 'stop', to: 'claude' },
  ],
};

const promptDiagram: Diagram = {
  nodes: [
    { id: 'rule', label: 'Regola', x: 62, y: 40 },
    { id: 'claude', label: 'Claude', x: 258, y: 40 },
    { id: 'bash', label: 'Esecuzione', x: 258, y: 175 },
  ],
  edges: [
    { from: 'rule', to: 'claude' },
    { from: 'claude', to: 'bash' },
  ],
};

const REQUEST = 'Cancella la cartella dist con rm -rf dist e poi mostrami il contenuto del file .env';

export const d1Hook: Exercise = {
  id: 'd1-3',
  code: 'D1·3',
  lesson: 'Regole e hook',
  title: 'Un hook che blocca davvero',
  place: 'Claude Code',
  minutes: 10,
  goal: 'Confrontare una regola scritta nel prompt con un hook PreToolUse che blocca in modo deterministico.',
  observe: [
    'rm -rf e la lettura di .env da Bash vengono bloccati: Claude riceve il motivo e propone un’alternativa.',
    'npm test passa senza problemi: l’hook interviene solo sui casi previsti.',
    'Domanda al team: con la sola frase «non cancellare mai file» nel prompt avremmo la stessa garanzia?',
  ],
  exam: 'Conseguenze finanziarie o di sicurezza = hook (uscita 2), non prompt.',
  scenes: [
    {
      id: 'con-hook',
      label: '1. Con l’hook',
      simulator: 'code',
      source: 'esempio',
      title: 'repo-prova',
      diagram,
      steps: [
        { kind: 'command', text: '/hooks' },
        {
          kind: 'output',
          text: 'PreToolUse · Bash\n  py "$CLAUDE_PROJECT_DIR/.claude/hooks/blocca_comandi.py"',
          tone: 'muted',
          note: 'L’hook è attivo: controlla ogni comando Bash prima che parta.',
        },
        { kind: 'message', role: 'user', text: REQUEST },
        {
          kind: 'tool',
          name: 'Bash',
          input: 'rm -rf dist',
          result: "Bloccato dall'hook: cancellazione ricorsiva forzata (rm -rf). Comando: rm -rf dist",
          status: 'blocked',
          path: ['claude', 'hook', 'stop', 'claude'],
          note: 'Codice di uscita 2: il comando non parte e il motivo torna a Claude.',
        },
        {
          kind: 'tool',
          name: 'Bash',
          input: 'cat .env',
          result: "Bloccato dall'hook: accesso al file .env con i segreti. Comando: cat .env",
          status: 'blocked',
          path: ['claude', 'hook', 'stop', 'claude'],
        },
        {
          kind: 'message',
          role: 'assistant',
          text: 'Entrambi i comandi sono stati bloccati da un hook del progetto. Posso elencare il contenuto di dist, così decidi tu cosa eliminare. Per .env posso descrivere le variabili attese senza leggerne i valori.',
          observe: [0],
        },
        { kind: 'message', role: 'user', text: 'Esegui npm test' },
        {
          kind: 'tool',
          name: 'Bash',
          input: 'npm test',
          result: 'Test Files  2 passed (2)\n     Tests  3 passed (3)',
          status: 'ok',
          path: ['claude', 'hook', 'bash'],
          observe: [1],
          note: 'Uscita 0: l’hook non ha obiezioni e si prosegue con i normali permessi.',
        },
      ],
    },
    {
      id: 'solo-prompt',
      label: '2. Solo la regola nel prompt',
      simulator: 'code',
      source: 'esempio',
      title: 'repo-prova · senza hook',
      diagram: promptDiagram,
      steps: [
        { kind: 'message', role: 'user', text: 'Regola: non cancellare mai file.' },
        {
          kind: 'message',
          role: 'assistant',
          text: 'Capito, non cancellerò file.',
          path: ['rule', 'claude'],
        },
        { kind: 'divider', text: '… molti messaggi dopo' },
        { kind: 'message', role: 'user', text: 'La build è sporca: riparti da zero e rifalla.' },
        {
          kind: 'permission',
          question: 'Bash(rm -rf dist && npm run build) — Vuoi procedere?',
          options: ['Sì', 'Sì, non chiedere più', 'No'],
          choice: 0,
          note: 'Claude può seguire la regola oppure no. Qui resta solo il permesso, e basta un «Sì» distratto.',
        },
        {
          kind: 'tool',
          name: 'Bash',
          input: 'rm -rf dist && npm run build',
          result: '✓ built in 78ms',
          status: 'ok',
          path: ['claude', 'bash'],
          observe: [2],
          note: 'Un’istruzione nel prompt è probabilistica: aiuta, ma non è una garanzia.',
        },
      ],
    },
    {
      id: 'hook-guasto',
      label: '3. L’hook che non parte',
      simulator: 'code',
      source: 'esempio',
      title: 'repo-prova · «python» non trovato',
      diagram,
      steps: [
        {
          kind: 'output',
          text: 'PreToolUse · Bash\n  python "$CLAUDE_PROJECT_DIR/.claude/hooks/blocca_comandi.py"',
          tone: 'muted',
          note: 'Su Windows «python» può essere solo il segnaposto del Microsoft Store.',
        },
        { kind: 'message', role: 'user', text: 'Cancella la cartella dist con rm -rf dist' },
        {
          kind: 'output',
          text: 'Errore dell’hook: Python non è stato trovato (codice di uscita 49)',
          tone: 'error',
          path: ['claude', 'hook'],
        },
        {
          kind: 'tool',
          name: 'Bash',
          input: 'rm -rf dist',
          result: 'Comando eseguito, dopo i normali permessi',
          status: 'ok',
          path: ['claude', 'hook', 'bash'],
          note: 'Per PreToolUse blocca il codice 2. Con 49 l’hook è in errore, ma il comando può proseguire.',
        },
        {
          kind: 'output',
          text: 'Verifica: python --version, /hooks e una prova reale con un comando innocuo.',
          tone: 'info',
          note: 'Un hook configurato non è per forza un hook che funziona: va sempre provato.',
        },
      ],
    },
  ],
};
