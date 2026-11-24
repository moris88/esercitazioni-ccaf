import type { Diagram, Exercise } from '../types';

const diagram: Diagram = {
  nodes: [
    { id: 'diff', label: 'git diff', x: 62, y: 40 },
    { id: 'claude', label: 'claude -p', x: 258, y: 40 },
    { id: 'json', label: 'JSON', x: 258, y: 175 },
    { id: 'next', label: 'Passo dopo', x: 62, y: 175 },
  ],
  edges: [
    { from: 'diff', to: 'claude' },
    { from: 'claude', to: 'json' },
    { from: 'json', to: 'next' },
  ],
};

export const d3Pipeline: Exercise = {
  id: 'd3-3',
  code: 'D3·3',
  lesson: 'Iterare e CI/CD',
  title: 'Claude Code come in una pipeline',
  place: 'Claude Code da terminale',
  minutes: 8,
  goal: 'Eseguire Claude Code in modalità non interattiva con output JSON e limiti, come in una pipeline.',
  observe: [
    'L’output JSON contiene la risposta e i metadati (durata, costo, turni): un passaggio successivo lo può leggere.',
    '--max-turns mette un tetto ai cicli: protegge tempi e costi.',
    'Senza -p Claude Code aspetterebbe un input che in pipeline nessuno darà.',
  ],
  exam: 'In CI: -p obbligatorio, output leggibile da programma, limiti di turni e spesa.',
  scenes: [
    {
      id: 'json',
      label: '1. Output JSON',
      simulator: 'terminal',
      source: 'esempio',
      title: 'repo-prova',
      diagram,
      steps: [
        {
          kind: 'command',
          text: 'claude -p "Quanti componenti React ci sono in src/components? Rispondi solo con il numero." --output-format json',
          path: ['claude'],
        },
        {
          kind: 'output',
          text: `{
  "type": "result",
  "subtype": "success",
  "is_error": false,
  "duration_ms": 6120,
  "num_turns": 2,
  "result": "4",
  "total_cost_usd": 0.04
}`,
          path: ['claude', 'json'],
          observe: [0],
          note: 'result è la risposta; il resto sono metadati. I valori qui sono di esempio.',
        },
      ],
    },
    {
      id: 'revisione',
      label: '2. Revisione del diff',
      simulator: 'terminal',
      source: 'esempio',
      title: 'repo-prova',
      diagram,
      steps: [
        { kind: 'command', text: 'bash ../kit/claude-code/ci/revisione.sh' },
        {
          kind: 'output',
          text: 'git diff HEAD~1 | claude -p "Rivedi questo diff. Elenca solo bug e problemi di sicurezza…" \\\n  --output-format json --max-turns 3 > revisione.json',
          tone: 'muted',
          path: ['diff', 'claude'],
          observe: [1],
          note: 'Il diff entra da stdin, la risposta finisce in un file.',
        },
        {
          kind: 'output',
          text: 'Risultato salvato in revisione.json\n{"subtype": "success", "num_turns": 1, "result": "Nessun bug o problema di sicurezza trovato."}',
          path: ['claude', 'json', 'next'],
        },
      ],
    },
    {
      id: 'senza-p',
      label: '3. Senza -p',
      simulator: 'terminal',
      source: 'esempio',
      title: 'pipeline',
      diagram,
      steps: [
        { kind: 'command', text: 'claude "Rivedi le modifiche"', path: ['claude'] },
        { kind: 'output', text: '> _', tone: 'normal' },
        { kind: 'output', text: '… in attesa di input …', tone: 'muted' },
        {
          kind: 'output',
          text: 'Job interrotto: superato il tempo massimo',
          tone: 'error',
          observe: [2],
          note: 'Uno scenario tipico: il comando è interattivo, ma davanti alla pipeline non c’è nessuno.',
        },
      ],
    },
  ],
};
