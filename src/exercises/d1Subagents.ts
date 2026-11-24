import type { Diagram, Exercise } from '../types';

const diagram: Diagram = {
  nodes: [
    { id: 'main', label: 'Coordinatore', x: 160, y: 40 },
    { id: 'a', label: 'Subagente 1', x: 62, y: 175 },
    { id: 'b', label: 'Subagente 2', x: 258, y: 175 },
  ],
  edges: [
    { from: 'main', to: 'a' },
    { from: 'a', to: 'main' },
    { from: 'main', to: 'b' },
    { from: 'b', to: 'main' },
  ],
};

export const d1Subagents: Exercise = {
  id: 'd1-2',
  code: 'D1·2',
  lesson: 'Coordinatore e subagenti',
  title: 'Subagenti in parallelo e contesto che non si eredita',
  place: 'Claude Code',
  minutes: 10,
  goal: 'Vedere più subagenti avviati insieme e verificare che un subagente non conosce ciò che è stato detto nella conversazione principale.',
  observe: [
    'Nel primo passo compaiono due chiamate Agent nella stessa risposta: partono insieme.',
    'Il primo subagente può proporre componenti Legacy: non ha la cronologia del coordinatore.',
    'Passando la regola nel prompt del subagente, l’elenco la rispetta.',
  ],
  exam: 'Parallelo = più chiamate Agent nella stessa risposta; il contesto va passato esplicitamente.',
  scenes: [
    {
      id: 'parallelo',
      label: '1. In parallelo',
      simulator: 'code',
      source: 'esempio',
      title: 'repo-prova',
      diagram,
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: 'Usa due subagenti in parallelo: il primo trova i componenti in src/ che non hanno un file di test; il secondo elenca le dipendenze di package.json che hanno una versione maggiore più recente. Poi unisci i risultati in una tabella.',
          path: ['main'],
        },
        { kind: 'tool', name: 'Agent', input: 'Componenti senza test', status: 'ok', path: ['main', 'a'] },
        {
          kind: 'tool',
          name: 'Agent',
          input: 'Dipendenze da aggiornare',
          status: 'ok',
          path: ['a', 'main', 'b'],
          observe: [0],
          note: 'Due chiamate nella stessa risposta: il secondo non aspetta il primo.',
        },
        {
          kind: 'output',
          text: 'Subagente 1: Button, OrderCard, LegacyBanner senza test\nSubagente 2: react e react-dom da 18 a 19',
          tone: 'info',
          path: ['a', 'main'],
        },
        {
          kind: 'table',
          columns: ['Ricerca', 'Risultato'],
          rows: [
            ['Componenti senza test', 'Button, OrderCard, LegacyBanner'],
            ['Nuova versione maggiore', 'react, react-dom'],
          ],
          path: ['b', 'main'],
        },
      ],
    },
    {
      id: 'senza-regola',
      label: '2. Regola non passata',
      simulator: 'code',
      source: 'esempio',
      title: 'repo-prova',
      diagram,
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: 'Ricorda questa regola del team: i componenti che iniziano con Legacy non vanno toccati.',
          path: ['main'],
        },
        {
          kind: 'message',
          role: 'assistant',
          text: 'Ricevuto.',
          note: 'La regola vive solo nella conversazione principale.',
        },
        {
          kind: 'message',
          role: 'user',
          text: 'Avvia un subagente e chiedigli di elencare i componenti che si possono rifattorizzare. Non ripetergli nessuna regola.',
        },
        {
          kind: 'tool',
          name: 'Agent',
          input: 'Elenca i componenti da rifattorizzare',
          result: '1. LegacyBanner: è una classe, si può convertire in funzione\n2. Header\n3. OrderCard',
          status: 'ok',
          path: ['main', 'a', 'main'],
          observe: [1],
          note: 'LegacyBanner è il primo della lista: il subagente non ha mai visto la regola.',
        },
      ],
    },
    {
      id: 'con-regola',
      label: '3. Regola passata',
      simulator: 'code',
      source: 'esempio',
      title: 'repo-prova',
      diagram,
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: 'Ora avvia un nuovo subagente passandogli per intero la regola sui componenti Legacy, e confronta i due elenchi.',
          path: ['main'],
        },
        {
          kind: 'tool',
          name: 'Agent',
          input:
            'Elenca i componenti da rifattorizzare. Regola: i componenti che iniziano con Legacy non vanno toccati',
          result: '1. Header\n2. OrderCard',
          status: 'ok',
          path: ['main', 'b', 'main'],
          observe: [2],
          note: 'Stesso compito, ma ora la regola è nel prompt del subagente.',
        },
        {
          kind: 'table',
          columns: ['Componente', 'Senza regola', 'Con regola'],
          rows: [
            ['LegacyBanner', 'proposto', 'escluso'],
            ['Header', 'proposto', 'proposto'],
            ['OrderCard', 'proposto', 'proposto'],
          ],
          highlight: [0],
        },
      ],
    },
  ],
};
