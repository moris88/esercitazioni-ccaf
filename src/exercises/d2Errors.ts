import type { Diagram, Exercise } from '../types';

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

export const EMPTY_RESULT = '{"results": []}';
export const ERROR_RESULT =
  '{"isError": true, "errorCategory": "transient", "isRetryable": true, "description": "Timeout del motore di ricerca dopo 30 secondi"}';

/** Stessa domanda: cambia solo ciò che lo strumento ha restituito */
export function buildErrorPrompt(result: string): string {
  return `Sei l'assistente del servizio clienti. Un cliente chiede: "Qual è la politica di reso per i dispositivi sopra i 500 euro?" Hai cercato nella knowledge base e lo strumento ti ha restituito:

${result}

Scrivi la risposta al cliente, in massimo 3 frasi.`;
}

const EMPTY_ANSWER =
  'Grazie per la domanda. Al momento non trovo informazioni specifiche sulla politica di reso per i dispositivi sopra i 500 euro, quindi preferisco non darle indicazioni che potrebbero non essere corrette. Posso inoltrare la richiesta a un collega del nostro team […]';
const TITLE = 'risposta registrata con claude -p · modello sonnet';

export const d2Errors: Exercise = {
  id: 'd2-2',
  code: 'D2·2',
  lesson: 'Errori degli strumenti',
  title: 'Vuoto, errore o soppressione silenziosa',
  place: 'Claude (app o claude.ai)',
  minutes: 7,
  goal: 'Vedere come cambia la risposta di Claude se lo strumento restituisce un risultato vuoto, un errore strutturato o un guasto nascosto.',
  observe: [
    'Con l’errore strutturato Claude dice che non è riuscito a cercare e propone di riprovare.',
    'Con la soppressione Claude crede che la ricerca sia riuscita: non segnala il guasto.',
    'Claude non può distinguere ciò che lo strumento non gli dice.',
  ],
  exam: '[] con 200 = informazione; timeout = errore; mai soppressione silenziosa.',
  scenes: [
    {
      id: 'vuoto',
      label: '1. Vuoto',
      description:
        'In chat si incolla ciò che lo strumento avrebbe restituito. Qui la ricerca è riuscita ma non ha trovato nulla: la lista vuota è un’informazione vera.',
      simulator: 'chat',
      source: 'reale',
      title: TITLE,
      diagram,
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: buildErrorPrompt(EMPTY_RESULT),
          path: ['claude', 'tool', 'kb'],
        },
        {
          kind: 'message',
          role: 'assistant',
          text: EMPTY_ANSWER,
          path: ['tool', 'claude', 'answer'],
          note: 'Affermazione corretta: il risultato vuoto è un’informazione.',
        },
      ],
    },
    {
      id: 'errore',
      label: '2. Errore strutturato',
      description:
        'Stessa domanda, ma lo strumento dichiara il guasto: dice che c’è stato un timeout e che riprovare ha senso. La risposta al cliente cambia.',
      simulator: 'chat',
      source: 'reale',
      title: TITLE,
      diagram,
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: buildErrorPrompt(ERROR_RESULT),
          path: ['claude', 'tool', 'kb'],
        },
        {
          kind: 'message',
          role: 'assistant',
          text: 'Mi dispiace, in questo momento non riesco a consultare le informazioni sulla politica di reso […] a causa di un problema tecnico temporaneo. […] può riprovare tra qualche minuto, oppure posso riprendere la ricerca non appena il sistema risponde. […]',
          path: ['tool', 'claude', 'answer'],
          observe: [0],
          note: 'Sa che non ha cercato davvero, quindi non afferma nulla sulla politica.',
        },
      ],
    },
    {
      id: 'soppressione',
      label: '3. Soppressione',
      description:
        'Il servizio è guasto, ma lo strumento lo nasconde e restituisce una lista vuota. Il messaggio è identico alla scena 1, quindi Claude non può accorgersene.',
      simulator: 'chat',
      source: 'reale',
      title: `${TITLE} (la stessa della scena 1)`,
      diagram,
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: buildErrorPrompt(EMPTY_RESULT),
          path: ['claude', 'tool', 'kb'],
          observe: [2],
          note: 'Testo identico alla scena 1: la differenza esiste solo fuori dalla chat.',
        },
        {
          kind: 'message',
          role: 'assistant',
          text: EMPTY_ANSWER,
          path: ['tool', 'claude', 'answer'],
          observe: [1],
          note: 'Il tono è prudente, ma il cliente crede che la ricerca sia riuscita.',
        },
      ],
    },
  ],
};
