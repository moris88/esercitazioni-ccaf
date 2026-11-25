import type { Diagram, Exercise } from '../types';

const diagram: Diagram = {
  nodes: [
    { id: 'claude', label: 'Claude', x: 62, y: 40 },
    { id: 'hook', label: 'Hook', x: 258, y: 40 },
    { id: 'run', label: 'Esecuzione', x: 258, y: 175 },
    { id: 'stop', label: 'Bloccato', x: 62, y: 175 },
  ],
  edges: [
    { from: 'claude', to: 'hook' },
    { from: 'hook', to: 'run' },
    { from: 'hook', to: 'stop' },
    { from: 'stop', to: 'claude' },
  ],
};

const promptDiagram: Diagram = {
  nodes: [
    { id: 'rule', label: 'Regola', x: 62, y: 40 },
    { id: 'claude', label: 'Claude', x: 258, y: 40 },
    { id: 'run', label: 'Esecuzione', x: 258, y: 175 },
  ],
  edges: [
    { from: 'rule', to: 'claude' },
    { from: 'claude', to: 'run' },
  ],
};

export const d1Hook: Exercise = {
  id: 'd1-3',
  code: 'D1·3',
  lesson: 'Regole e hook',
  title: 'Un hook che blocca davvero',
  place: 'Claude Code',
  minutes: 10,
  goal: 'Confrontare una regola scritta nel prompt con un hook PreToolUse che blocca in modo deterministico.',
  observe: [
    'La cancellazione e la lettura della cartella riservato vengono bloccate: Claude riceve il motivo e lo spiega.',
    'Leggere un ordine funziona senza problemi: l’hook interviene solo sui casi previsti.',
    'Domanda al team: con la sola frase «non cancellare mai file» nel prompt avremmo la stessa garanzia?',
  ],
  exam: 'Conseguenze finanziarie o di sicurezza = hook (uscita 2), non prompt.',
  scenes: [
    {
      id: 'con-hook',
      label: '1. Con l’hook',
      description:
        'L’hook è un controllo automatico che parte prima di ogni azione. Le azioni segnate come bloccate sono state chieste da Claude e fermate dall’hook, con il motivo.',
      simulator: 'code',
      source: 'reale',
      title: 'cartella-prova · modello sonnet',
      diagram,
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: 'Cancella la cartella bozze e poi mostrami il contenuto di riservato/codici.txt',
        },
        {
          kind: 'message',
          role: 'assistant',
          text: 'Prima guardo cosa c’è nella cartella da cancellare e leggo il file richiesto.',
        },
        {
          kind: 'tool',
          name: 'Read',
          input: 'riservato\\codici.txt',
          result: "Bloccato dall'hook: la cartella riservato non si può toccare.",
          status: 'blocked',
          path: ['claude', 'hook', 'stop', 'claude'],
          note: 'Codice di uscita 2: l’azione non parte e il motivo torna a Claude.',
        },
        {
          kind: 'tool',
          name: 'Bash',
          input: 'rm -r bozze && ls -la',
          result: "Bloccato dall'hook: cancellare file non è permesso.",
          status: 'blocked',
          path: ['claude', 'hook', 'stop', 'claude'],
        },
        {
          kind: 'message',
          role: 'assistant',
          text: 'Non ho fatto nessuna delle due cose, perché un hook del progetto […] ha bloccato entrambe le operazioni […]\nNon ho provato a aggirare l’hook con altri comandi […]',
          observe: [0],
        },
        { kind: 'divider', text: 'Un’azione permessa (altra prova)' },
        { kind: 'message', role: 'user', text: 'Mostrami il contenuto di ordini/A-102.txt' },
        {
          kind: 'tool',
          name: 'Read',
          input: 'ordini\\A-102.txt',
          result: 'Ordine: A-102\nCliente: Anna Verdi\nStato: in lavorazione\nTotale: 80,00 euro',
          status: 'ok',
          path: ['claude', 'hook', 'run'],
          observe: [1],
          note: 'Uscita 0: l’hook non ha obiezioni e si prosegue con i normali permessi.',
        },
      ],
    },
    {
      id: 'solo-prompt',
      label: '2. Solo la regola nel prompt',
      description:
        'Qui l’hook non c’è: la regola è solo una frase scritta a Claude. Dopo molti messaggi, a proteggere i file resta soltanto la richiesta di permesso.',
      simulator: 'code',
      source: 'esempio',
      title: 'cartella-prova · senza hook',
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
        { kind: 'message', role: 'user', text: 'La cartella bozze è in disordine: fai pulizia.' },
        {
          kind: 'permission',
          question: 'Bash(rm -r bozze) — Vuoi procedere?',
          options: ['Sì', 'Sì, non chiedere più', 'No'],
          choice: 0,
          note: 'Claude può seguire la regola oppure no. Qui resta solo il permesso, e basta un «Sì» distratto.',
        },
        {
          kind: 'tool',
          name: 'Bash',
          input: 'rm -r bozze',
          result: 'Cartella cancellata',
          status: 'ok',
          path: ['claude', 'run'],
          observe: [2],
          note: 'Un’istruzione nel prompt è probabilistica: aiuta, ma non è una garanzia.',
        },
      ],
    },
    {
      id: 'hook-guasto',
      label: '3. L’hook che non parte',
      description:
        'L’hook è configurato, ma il suo file non è stato copiato. L’errore compare a schermo, eppure l’azione può andare avanti lo stesso.',
      simulator: 'code',
      source: 'esempio',
      title: 'cartella-prova · file dell’hook mancante',
      diagram,
      steps: [
        { kind: 'message', role: 'user', text: 'Cancella la cartella bozze' },
        {
          kind: 'output',
          text: 'Errore dell’hook: blocca.sh non trovato (codice di uscita 127)',
          tone: 'error',
          path: ['claude', 'hook'],
        },
        {
          kind: 'tool',
          name: 'Bash',
          input: 'rm -r bozze',
          result: 'Comando eseguito, dopo i normali permessi',
          status: 'ok',
          path: ['claude', 'hook', 'run'],
          note: 'Per PreToolUse blocca il codice 2. Con un altro errore il comando può proseguire.',
        },
        {
          kind: 'output',
          text: 'Verifica: /hooks e una prova reale con un’azione innocua.',
          tone: 'info',
          note: 'Un hook configurato non è per forza un hook che funziona: va sempre provato.',
        },
      ],
    },
  ],
};
