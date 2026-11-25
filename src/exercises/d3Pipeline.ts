import type { Diagram, Exercise } from '../types';

const diagram: Diagram = {
  nodes: [
    { id: 'docs', label: 'Documenti', x: 62, y: 40 },
    { id: 'claude', label: 'claude -p', x: 258, y: 40 },
    { id: 'json', label: 'JSON', x: 258, y: 175 },
    { id: 'next', label: 'Passo dopo', x: 62, y: 175 },
  ],
  edges: [
    { from: 'docs', to: 'claude' },
    { from: 'claude', to: 'json' },
    { from: 'json', to: 'next' },
  ],
};

export const COUNT_COMMAND =
  'claude -p "Quanti file ci sono nella cartella procedure? Rispondi solo con il numero." --output-format json';
export const REVIEW_COMMAND =
  'claude -p "Rivedi i documenti della cartella procedure. Elenca solo le contraddizioni, con documento e motivo." --output-format json --max-turns 8 --allowedTools "Read,Glob,Grep" > revisione.json';

export const d3Pipeline: Exercise = {
  id: 'd3-3',
  code: 'D3·3',
  lesson: 'Iterare e CI/CD',
  title: 'Claude Code come in una pipeline',
  place: 'Terminale',
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
      description:
        'Il terminale, senza aprire Claude Code: un solo comando fa la domanda e stampa la risposta insieme ai dati sull’esecuzione.',
      simulator: 'terminal',
      source: 'reale',
      title: 'cartella-prova · modello sonnet · campi principali',
      diagram,
      steps: [
        { kind: 'command', text: COUNT_COMMAND, path: ['docs', 'claude'] },
        {
          kind: 'output',
          text: `{
  "type": "result",
  "subtype": "success",
  "is_error": false,
  "duration_ms": 2211,
  "num_turns": 2,
  "result": "5",
  "total_cost_usd": 0.0277438,
  …
}`,
          path: ['claude', 'json'],
          observe: [0],
          note: 'Qui i file erano 5 perché c’era anche sconti.md, creato in D4·3. Costi e tempi cambiano ogni volta.',
        },
      ],
    },
    {
      id: 'revisione',
      label: '2. Revisione automatica',
      description:
        'Un comando più lungo chiede una revisione dei documenti, limita giri e strumenti e salva la risposta nel file revisione.json. Sotto, alcuni campi del file.',
      simulator: 'terminal',
      source: 'reale',
      title: 'cartella-prova · modello sonnet',
      diagram,
      steps: [
        {
          kind: 'command',
          text: REVIEW_COMMAND,
          path: ['docs', 'claude'],
          observe: [1],
          note: '--allowedTools approva in anticipo la lettura; > salva la risposta in un file.',
        },
        {
          kind: 'output',
          text: '"subtype": "success", "num_turns": 6, "duration_ms": 8565, "total_cost_usd": 0.0615979…',
          tone: 'muted',
          path: ['claude', 'json'],
        },
        {
          kind: 'output',
          text: '"result": "Contraddizioni trovate nella cartella `procedure`:\n\n1. garanzie.md (punto 2) vs rimborsi.md (punto 1): il termine per chiedere il rimborso è diverso. […]"',
          path: ['json', 'next'],
          note: 'Ha trovato la contraddizione tra 14 e 30 giorni: un passaggio successivo può leggerla e avvisare.',
        },
      ],
    },
    {
      id: 'senza-p',
      label: '3. Senza -p',
      description:
        'Lo stesso tentativo senza -p: il programma si apre e aspetta che qualcuno scriva. In un processo automatico non c’è nessuno, quindi scade il tempo.',
      simulator: 'terminal',
      source: 'esempio',
      title: 'processo automatico',
      diagram,
      steps: [
        { kind: 'command', text: 'claude "Rivedi i documenti"', path: ['claude'] },
        { kind: 'output', text: '> _', tone: 'normal' },
        { kind: 'output', text: '… in attesa di input …', tone: 'muted' },
        {
          kind: 'output',
          text: 'Processo interrotto: superato il tempo massimo',
          tone: 'error',
          observe: [2],
          note: 'Uno scenario tipico: il comando è interattivo, ma davanti alla pipeline non c’è nessuno.',
        },
      ],
    },
  ],
};
