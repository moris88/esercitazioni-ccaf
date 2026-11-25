import type { Diagram, Exercise } from '../types';

const pipeline: Diagram = {
  nodes: [
    { id: 'pr', label: 'Pull request', x: 62, y: 40 },
    { id: 'test', label: 'Test', x: 258, y: 40 },
    { id: 'review', label: 'claude -p', x: 258, y: 175 },
    { id: 'merge', label: 'Merge', x: 62, y: 175 },
  ],
  edges: [
    { from: 'pr', to: 'test' },
    { from: 'test', to: 'review' },
    { from: 'review', to: 'merge' },
  ],
};

export const p5Development: Exercise = {
  id: 'p-5',
  code: 'P·5',
  lesson: 'Pre-corso · Sviluppo software',
  title: 'Git, CI/CD, funzioni e regole garantite',
  place: 'Claude (app o claude.ai)',
  minutes: 10,
  goal: 'Seguire una modifica dal branch alla pipeline e distinguere ciò che il codice garantisce da ciò che il modello interpreta.',
  observe: [
    'Ciò che finisce nel repository è condiviso con il team; settings.local.json e ~/.claude/ restano personali.',
    'In pipeline un exit code diverso da zero ferma tutto, e nessuno risponde alle domande.',
    'Un tool è la descrizione di una funzione: Claude chiede la chiamata, l’applicazione la esegue.',
    '«Sempre», «mai», «garantire» → soluzione deterministica: codice, hook, permessi, schema.',
  ],
  exam: 'Il prompt aumenta la probabilità di un comportamento; il codice lo garantisce.',
  scenes: [
    {
      id: 'git',
      label: '1. Git',
      description:
        'Una modifica salvata con Git, passo per passo. La tabella dice quali file si condividono con il team e quali restano personali.',
      simulator: 'terminal',
      source: 'esempio',
      title: 'ciclo di lavoro',
      steps: [
        { kind: 'command', text: 'git checkout -b correzione-login' },
        { kind: 'command', text: 'git diff' },
        {
          kind: 'output',
          text: '- if (password.length > 6)\n+ if (password.length >= 8)',
          tone: 'info',
          note: 'Il diff è ciò che si mostra a Claude per una code review.',
        },
        { kind: 'command', text: 'git add app.ts && git commit -m "Corregge il controllo della password"' },
        {
          kind: 'table',
          columns: ['File', 'Condiviso o personale'],
          rows: [
            ['CLAUDE.md', 'condiviso'],
            ['.claude/settings.json', 'condiviso'],
            ['.mcp.json', 'condiviso'],
            ['.claude/settings.local.json', 'personale'],
            ['~/.claude/', 'personale'],
          ],
          highlight: [3, 4],
          observe: [0],
        },
      ],
    },
    {
      id: 'pipeline',
      label: '2. Pipeline',
      description:
        'Una catena di controlli automatici. Al primo errore si ferma; dopo la correzione arriva fino alla revisione di Claude.',
      simulator: 'terminal',
      source: 'esempio',
      title: 'GitHub Actions',
      diagram: pipeline,
      steps: [
        { kind: 'output', text: 'on: pull_request', tone: 'muted', path: ['pr'] },
        { kind: 'output', text: '✓ npm install', tone: 'info' },
        { kind: 'output', text: '✗ npm test   exit code 1', tone: 'error', path: ['pr', 'test'] },
        {
          kind: 'output',
          text: 'Pipeline fermata: revisione e merge non partono',
          tone: 'error',
          observe: [1],
        },
        { kind: 'divider', text: 'Dopo la correzione' },
        { kind: 'output', text: '✓ npm test   exit code 0', tone: 'info', path: ['pr', 'test'] },
        {
          kind: 'output',
          text: '✓ claude -p "Rivedi il diff e segnala problemi" --output-format json\n  ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}',
          tone: 'info',
          path: ['test', 'review'],
          note: 'Segreti dalla piattaforma, output leggibile da un programma, strumenti al minimo.',
        },
        { kind: 'output', text: 'PR pronta per l’approvazione', path: ['review', 'merge'] },
      ],
    },
    {
      id: 'funzione',
      label: '3. Dalla funzione al tool',
      description:
        'In alto la scheda di una funzione, sotto come ogni sua parte diventa un pezzo della descrizione di uno strumento per Claude.',
      simulator: 'terminal',
      source: 'esempio',
      title: 'cerca_ordine',
      steps: [
        {
          kind: 'output',
          text: 'Funzione cerca_ordine\n  Che cosa fa: restituisce lo stato di un ordine\n  Riceve: identificativo dell’ordine (testo)\n  Restituisce: stato dell’ordine\n  Se l’ordine non esiste: errore «Ordine non trovato»',
        },
        {
          kind: 'table',
          columns: ['Nella funzione', 'Nel tool'],
          rows: [
            ['nome', 'name'],
            ['che cosa fa', 'description'],
            ['che cosa riceve', 'input_schema'],
            ['che cosa restituisce', 'contenuto del tool_result'],
            ['errore', 'tool_result con is_error: true'],
          ],
        },
        {
          kind: 'output',
          text: 'Claude → tool_use cerca_ordine("A-101")\nApplicazione → esegue la funzione → tool_result',
          tone: 'info',
          observe: [2],
          note: 'Claude legge la descrizione, non il codice: per questo dev’essere chiara.',
        },
      ],
    },
    {
      id: 'deterministico',
      label: '4. Deterministico o probabilistico',
      description:
        'Quattro regole da sistemare: alcune vanno garantite dal codice, altre possono essere interpretate dal modello.',
      simulator: 'terminal',
      source: 'esempio',
      title: 'dove mettere la regola?',
      steps: [
        {
          kind: 'output',
          text: 'A. Il rimborso sopra 500 € deve SEMPRE essere approvato\nB. Capire se il cliente è scontento\nC. Claude non deve MAI cancellare file\nD. Riassumere un contratto',
          note: 'Domanda al team: codice o modello?',
        },
        {
          kind: 'table',
          columns: ['Caso', 'Dove', 'Come'],
          rows: [
            ['A. Rimborso', 'codice', 'hook o condizione che blocca il tool'],
            ['B. Tono', 'modello', 'testo libero da interpretare'],
            ['C. Cancellazioni', 'codice', 'regola deny nei permessi'],
            ['D. Riassunto', 'modello', 'testo non strutturato'],
          ],
          highlight: [0, 2],
          observe: [3],
        },
      ],
    },
  ],
};
