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

/** Nella registrazione lo strumento è stato chiamato tre volte */
const EMPTY_RESULTS = Array(3).fill('lo strumento ha restituito: is_error=False  {"results": []}').join('\n');

function buildScene(id: string, label: string, steps: Step[]): Scene {
  return {
    id,
    label,
    simulator: 'terminal',
    source: 'reale',
    title: 'kit/claude-p · modello sonnet',
    diagram,
    steps: [
      { kind: 'command', text: 'CLAUDE_MODEL=sonnet python vuoto_o_errore.py' },
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
        text: EMPTY_RESULTS,
        tone: 'info',
        path: ['claude', 'tool', 'kb'],
        note: 'La ricerca è riuscita, senza risultati. Claude ha riprovato con altre parole: tre chiamate.',
      },
      {
        kind: 'output',
        text: 'risposta di Claude:\nNon ho trovato nella knowledge base nessuna informazione sulla politica di reso per i dispositivi elettronici sopra i 500 euro. Non voglio darti indicazioni inventate. […]',
        path: ['tool', 'claude', 'answer'],
        note: 'Affermazione corretta: il risultato vuoto è un’informazione.',
      },
    ]),
    buildScene('errore', '2. Errore strutturato', [
      {
        kind: 'output',
        text: 'lo strumento ha restituito: is_error=True\n{"errorCategory": "transient", "isRetryable": true, "description": "Timeout del motore di ricerca dopo 30 secondi", "attempted_query": "politica di reso dispositivi elettronici sopra 500 euro"}',
        tone: 'error',
        path: ['claude', 'tool', 'kb'],
      },
      {
        kind: 'output',
        text: '(altre due chiamate con lo stesso errore; nell’ultima la query è "reso elettronica")',
        tone: 'muted',
        path: ['tool', 'claude', 'tool'],
        note: 'isRetryable: true gli dice che riprovare ha senso, e lo fa.',
      },
      {
        kind: 'output',
        text: 'risposta di Claude:\nAl momento non riesco a consultare la knowledge base: la ricerca è andata in timeout per tre volte di seguito, anche con una query più semplice. Per questo non posso dirti con certezza qual è la politica di reso […] Se vuoi, riprovo io adesso.',
        path: ['claude', 'answer'],
        observe: [0],
        note: 'Sa che non ha cercato davvero, quindi non afferma nulla sulla politica.',
      },
    ]),
    buildScene('soppressione', '3. Soppressione', [
      {
        kind: 'output',
        text: EMPTY_RESULTS,
        tone: 'info',
        path: ['claude', 'tool', 'kb'],
        observe: [2],
        note: 'Qui il servizio è giù, ma lo strumento non lo dice: output identico alla scena 1.',
      },
      {
        kind: 'output',
        text: 'risposta di Claude:\nNon ho trovato nella knowledge base nessun articolo sulla politica di reso, né per i dispositivi elettronici sopra i 500 euro né in generale. Preferisco non darti informazioni inventate. […]',
        path: ['tool', 'claude', 'answer'],
        observe: [1],
        note: 'In questa prova il tono è prudente, ma non segnala il guasto: il cliente crede che la ricerca sia riuscita.',
      },
    ]),
  ],
};
