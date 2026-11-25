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
const RULE =
  "Regola del team: la procedura sui rimborsi la modifica solo l'ufficio legale, quindi non va toccata.";

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
    'Il subagente senza regola propone di riscrivere rimborsi.md: non ha la cronologia del coordinatore.',
    'Passando la regola nel prompt del subagente, l’elenco la rispetta.',
  ],
  exam: 'Parallelo = più chiamate Agent nella stessa risposta; il contesto va passato esplicitamente.',
  scenes: [
    {
      id: 'parallelo',
      label: '1. In parallelo',
      description:
        'Claude fa da coordinatore: divide il lavoro fra due subagenti, che leggono le procedure ognuno per conto proprio, e poi unisce i due risultati in una tabella.',
      simulator: 'code',
      source: 'reale',
      title: 'cartella-prova · modello sonnet',
      diagram,
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: 'Usa due subagenti in parallelo: il primo trova le procedure senza responsabile; il secondo elenca quelle non riviste dal 2025 in poi. Poi unisci i risultati in una tabella.',
          path: ['main'],
        },
        { kind: 'message', role: 'assistant', text: 'Lancio i due subagenti in parallelo.' },
        {
          kind: 'tool',
          name: 'Agent',
          input: 'Procedure senza responsabile',
          status: 'ok',
          path: ['main', 'a'],
        },
        {
          kind: 'tool',
          name: 'Agent',
          input: 'Procedure non riviste dal 2025',
          status: 'ok',
          path: ['a', 'main', 'b'],
          observe: [0],
          note: 'Due chiamate nella stessa risposta: il secondo non aspetta il primo.',
        },
        {
          kind: 'table',
          columns: ['Procedura', 'Ultima revisione', 'Senza responsabile', 'Non rivista dal 2025'],
          rows: [
            ['Garanzie', '15/06/2026', 'Sì', 'No'],
            ['Listino 2023', '08/01/2023', 'Sì', 'Sì'],
            ['Spedizioni', '02/03/2024', 'No', 'Sì'],
          ],
          path: ['b', 'main'],
          note: 'Estratto della tabella finale: il coordinatore unisce i due elenchi.',
        },
      ],
    },
    {
      id: 'senza-regola',
      label: '2. Regola non passata',
      description:
        'La regola è scritta solo al coordinatore. Il subagente parte da zero, senza averla mai vista, e restituisce il proprio elenco.',
      simulator: 'code',
      source: 'reale',
      title: 'cartella-prova · modello sonnet',
      diagram,
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: `${RULE} Avvia un subagente e chiedigli quali documenti in procedure si possono riscrivere. Non ripetergli nessuna regola. Riporta il suo elenco così com'è, in breve.`,
          path: ['main'],
        },
        {
          kind: 'tool',
          name: 'Agent',
          input: 'Nella cartella "procedure" […] quali documenti si possono riscrivere?',
          status: 'ok',
          path: ['main', 'a', 'main'],
          note: 'Nel compito passato al subagente la regola non c’è.',
        },
        {
          kind: 'message',
          role: 'assistant',
          text: 'Riscrivibili\n- garanzie.md […]\n- spedizioni.md […]\n- rimborsi.md: riscrivibile. […]\nDa non riscrivere\n- Archivio-listino-2023.md […]\n\nPer la regola del team, rimborsi.md non va toccato […]. Il subagente lo ha indicato come riscrivibile perché non conosceva la regola […]',
          observe: [1],
          note: 'L’errore lo segnala il coordinatore, che la regola la conosce.',
        },
      ],
    },
    {
      id: 'con-regola',
      label: '3. Regola passata',
      description:
        'Stesso compito, ma ora il coordinatore copia la regola dentro il messaggio per il subagente. L’elenco cambia.',
      simulator: 'code',
      source: 'reale',
      title: 'cartella-prova · modello sonnet',
      diagram,
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: `${RULE} Avvia un subagente passandogli per intero questa regola e chiedigli quali documenti in procedure si possono riscrivere. Riporta il suo elenco, in breve.`,
          path: ['main'],
        },
        {
          kind: 'tool',
          name: 'Agent',
          input:
            'Regola del team (da rispettare per intero): "la procedura sui rimborsi la modifica solo l\'ufficio legale, quindi non va toccata." […]',
          status: 'ok',
          path: ['main', 'b', 'main'],
        },
        {
          kind: 'message',
          role: 'assistant',
          text: 'Si possono riscrivere\n- spedizioni.md […]\n- garanzie.md: si può riscrivere, ma il punto 2 va lasciato intatto […]\nDa non toccare\n- rimborsi.md […]\n- Archivio-listino-2023.md […]',
          observe: [2],
          note: 'Stesso compito: cambia solo il contesto passato al subagente.',
        },
        {
          kind: 'table',
          columns: ['Documento', 'Senza regola', 'Con regola'],
          rows: [
            ['rimborsi.md', 'proposto', 'escluso'],
            ['garanzie.md', 'proposto', 'proposto, tranne il punto 2'],
            ['spedizioni.md', 'proposto', 'proposto'],
            ['Archivio-listino-2023.md', 'escluso', 'escluso'],
          ],
          highlight: [0],
          note: 'Riepilogo delle due prove.',
        },
      ],
    },
  ],
};
