import type { Diagram, Exercise, Scene, Step } from '../types';

const diagram: Diagram = {
  nodes: [
    { id: 'claude', label: 'Claude', x: 62, y: 40 },
    { id: 'tool', label: 'Strumento', x: 258, y: 40 },
    { id: 'kb', label: 'Servizio', x: 258, y: 175 },
    { id: 'answer', label: 'Risposta', x: 62, y: 175 },
  ],
  edges: [
    { from: 'claude', to: 'tool' },
    { from: 'tool', to: 'kb' },
    { from: 'tool', to: 'claude' },
    { from: 'claude', to: 'answer' },
  ],
};

function buildScene(id: string, label: string, steps: Step[]): Scene {
  return {
    id,
    label,
    simulator: 'terminal',
    source: 'esempio',
    title: 'kit/claude-p',
    diagram,
    steps: [
      { kind: 'command', text: 'python vuoto_o_errore.py' },
      {
        kind: 'output',
        text: 'Domanda: Qual è la politica di reso per i dispositivi elettronici sopra i 500 euro?',
        path: ['claude'],
      },
      { kind: 'divider', text: `===== Modalità: ${id}` },
      ...steps,
    ],
  };
}

export const d2Errors: Exercise = {
  id: 'd2-2',
  code: 'D2·2',
  lesson: 'Errori degli strumenti',
  title: 'Vuoto, errore o soppressione silenziosa',
  place: 'Terminale (claude -p)',
  minutes: 7,
  goal: 'Vedere come cambia la risposta di Claude se lo strumento restituisce un risultato vuoto, un errore strutturato o un guasto nascosto.',
  observe: [
    'Con l’errore strutturato Claude dice che non è riuscito a cercare e propone di riprovare.',
    'Con la soppressione dice con sicurezza che non c’è nulla: un’affermazione falsa.',
    'Claude non può distinguere ciò che lo strumento non gli dice.',
  ],
  exam: '[] con 200 = informazione; timeout = errore; mai soppressione silenziosa.',
  scenes: [
    buildScene('vuoto', '1. Vuoto', [
      {
        kind: 'output',
        text: 'lo strumento ha restituito: is_error=False  {"results": []}',
        tone: 'info',
        path: ['claude', 'tool', 'kb'],
        note: 'La ricerca è riuscita: semplicemente non c’è nessun articolo.',
      },
      {
        kind: 'output',
        text: 'risposta di Claude:\nNella knowledge base non ho trovato una politica di reso specifica per questi prodotti.',
        path: ['tool', 'claude', 'answer'],
        note: 'Affermazione corretta: il risultato vuoto è un’informazione.',
      },
    ]),
    buildScene('errore', '2. Errore strutturato', [
      {
        kind: 'output',
        text: 'lo strumento ha restituito: is_error=True\n{"errorCategory": "transient", "isRetryable": true,\n "description": "Timeout del motore di ricerca dopo 30 secondi"}',
        tone: 'error',
        path: ['claude', 'tool', 'kb'],
      },
      {
        kind: 'output',
        text: 'risposta di Claude:\nNon sono riuscito a consultare la knowledge base: la ricerca è andata in timeout. Il problema sembra temporaneo, vuole che riprovi?',
        path: ['tool', 'claude', 'answer'],
        observe: [0],
        note: 'Sa che non ha cercato davvero, quindi non afferma nulla sulla politica.',
      },
    ]),
    buildScene('soppressione', '3. Soppressione', [
      {
        kind: 'output',
        text: '(il servizio è giù, ma lo strumento non lo dice)',
        tone: 'muted',
        path: ['claude', 'tool', 'kb'],
      },
      {
        kind: 'output',
        text: 'lo strumento ha restituito: is_error=False  {"results": []}',
        tone: 'info',
        path: ['tool', 'claude'],
        observe: [2],
        note: 'Identico alla scena 1: in server_mcp.py i due rami restituiscono la stessa cosa.',
      },
      {
        kind: 'output',
        text: 'risposta di Claude:\nNella knowledge base non esiste una politica di reso specifica per questi prodotti.',
        path: ['claude', 'answer'],
        observe: [1],
        note: 'Detto con sicurezza, ma nessuno ha potuto controllare: il cliente riceve un’informazione falsa.',
      },
    ]),
  ],
};
