import type { Diagram, Exercise } from '../types';

const diagram: Diagram = {
  nodes: [
    { id: 'memory', label: 'CLAUDE.md', x: 62, y: 40 },
    { id: 'claude', label: 'Claude', x: 258, y: 40 },
    { id: 'rule', label: 'risposte.md', x: 62, y: 175 },
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
  goal: 'Creare CLAUDE.md, aggiungere una regola con paths e vedere che vale solo per i file giusti.',
  observe: [
    'La nuova risposta inizia con «Gentile cliente», è breve e non promette date: rispetta la regola.',
    'La regola vale per la cartella risposte, non per la modifica a spedizioni.md.',
    '/memory mostra la gerarchia: CLAUDE.md di progetto, utente ed eventuali file locali.',
  ],
  exam: 'Regole con paths = una sola fonte per file sparsi; CLAUDE.md di progetto = condiviso.',
  scenes: [
    {
      id: 'init',
      label: '1. /init e regola',
      description:
        'Con /init Claude Code guarda la cartella e scrive una prima versione di CLAUDE.md. Poi si aggiunge una regola che vale solo per la cartella risposte.',
      simulator: 'code',
      source: 'esempio',
      title: 'cartella-prova',
      diagram,
      steps: [
        { kind: 'command', text: '/init' },
        {
          kind: 'tool',
          name: 'Write',
          input: 'CLAUDE.md',
          result:
            '# CLAUDE.md\nDocumenti di un negozio online.\nCartelle: procedure, ordini, spedizioni, risposte',
          status: 'ok',
          path: ['memory', 'claude'],
          note: 'Uno scheletro: va riletto e corretto prima di condividerlo.',
        },
        {
          kind: 'message',
          role: 'user',
          text: 'Copia il file ../kit/claude-code/rules/risposte.md nella cartella .claude/rules',
        },
        {
          kind: 'output',
          text: 'paths:\n  - "risposte/**"\n\n- Inizia sempre con "Gentile cliente,".\n- Massimo 5 righe di testo.\n- Non promettere mai una data di consegna.',
          tone: 'info',
          path: ['rule'],
          note: 'paths decide per quali file viene caricata la regola.',
        },
      ],
    },
    {
      id: 'applicazione',
      label: '2. Dove si applica',
      description:
        'Due richieste in due cartelle diverse. La prima tocca risposte, dove la regola vale; la seconda modifica una procedura, dove la regola non vale.',
      simulator: 'code',
      source: 'reale',
      title: 'cartella-prova · modello sonnet',
      diagram,
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: 'Scrivi in risposte/ritardo.md una risposta per un cliente con il pacco in ritardo. Guarda prima come sono scritte le altre risposte.',
        },
        {
          kind: 'tool',
          name: 'Read',
          input: 'risposte\\pacco-danneggiato.md',
          status: 'ok',
          path: ['rule', 'claude', 'file'],
          note: 'Questo file corrisponde a paths.',
        },
        {
          kind: 'tool',
          name: 'Write',
          input: 'risposte\\ritardo.md',
          result:
            "Gentile cliente,\n\nci dispiace per il ritardo. Ci invii il numero d'ordine e procederemo con la verifica dello stato della spedizione.\n\nCordiali saluti,\nIl servizio clienti",
          status: 'ok',
          observe: [0],
          note: 'Attenzione: anche la risposta usata come modello era scritta così. Per isolare la regola, provate a toglierla.',
        },
        { kind: 'divider', text: 'Nuova sessione' },
        {
          kind: 'message',
          role: 'user',
          text: 'Aggiungi in fondo a procedure/spedizioni.md un punto 4: i pacchi danneggiati vanno fotografati.',
        },
        {
          kind: 'tool',
          name: 'Edit',
          input: 'procedure\\spedizioni.md',
          result: '4. I pacchi danneggiati vanno fotografati.',
          status: 'ok',
          path: ['memory', 'claude', 'file'],
          observe: [1],
          note: 'spedizioni.md non corrisponde a paths.',
        },
      ],
    },
    {
      id: 'memory',
      label: '3. /memory',
      description:
        'Il comando /memory elenca i file di istruzioni caricati: quello personale e quello del progetto.',
      simulator: 'code',
      source: 'esempio',
      title: 'cartella-prova',
      diagram,
      steps: [
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
