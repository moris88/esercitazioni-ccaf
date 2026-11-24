import type { Diagram, Exercise } from '../types';

const diagram: Diagram = {
  nodes: [
    { id: 'main', label: 'Coordinatore', x: 160, y: 40 },
    { id: 'orders', label: 'Ordini', x: 62, y: 175 },
    { id: 'ship', label: 'Spedizioni', x: 258, y: 175 },
  ],
  edges: [
    { from: 'main', to: 'orders' },
    { from: 'orders', to: 'main' },
    { from: 'main', to: 'ship' },
    { from: 'ship', to: 'main' },
  ],
};

export const p7Architecture: Exercise = {
  id: 'p-7',
  code: 'P·7',
  lesson: 'Pre-corso · Architettura e affidabilità',
  title: 'Orchestrazione, guasti parziali ed escalation',
  place: 'Integrazione dal pre-corso',
  minutes: 8,
  goal: 'Vedere come i componenti collaborano, che cosa succede se uno si guasta e quando serve una persona.',
  observe: [
    'Si parallelizza solo ciò che è indipendente; se un passo usa il risultato di un altro, è sequenziale.',
    'Degradazione controllata: servizio ridotto, dichiarando che cosa manca.',
    'Una buona escalation porta con sé tutte le informazioni per non ricominciare da capo.',
    'Lo SLA può decidere tra tempo reale e batch.',
  ],
  exam: 'Mai nascondere un guasto parziale; escalation con riepilogo; lo SLA guida la scelta.',
  scenes: [
    {
      id: 'parallelo',
      label: '1. Parallelo o sequenziale',
      simulator: 'terminal',
      source: 'esempio',
      title: 'tempi di esempio',
      panes: ['Indipendenti: parallelo', 'Dipendenti: sequenziale'],
      diagram,
      steps: [
        {
          kind: 'output',
          pane: 0,
          text: '0 s  avvio Ordini e Spedizioni',
          path: ['main', 'orders', 'main', 'ship'],
        },
        {
          kind: 'output',
          pane: 0,
          text: '3 s  Ordini ✓   3 s  Spedizioni ✓',
          tone: 'info',
          path: ['orders', 'main'],
        },
        { kind: 'output', pane: 0, text: 'Totale: 3 s' },
        {
          kind: 'output',
          pane: 1,
          text: '0 s  Ordini: trova l’ID della spedizione',
          path: ['main', 'orders'],
        },
        { kind: 'output', pane: 1, text: '3 s  Spedizioni: usa quell’ID', path: ['orders', 'main', 'ship'] },
        {
          kind: 'output',
          pane: 1,
          text: 'Totale: 6 s',
          observe: [0],
          note: 'Qui il secondo passo non può partire prima: gli manca l’ID.',
        },
      ],
    },
    {
      id: 'degradazione',
      label: '2. Guasto parziale',
      simulator: 'chat',
      source: 'esempio',
      title: 'servizio spedizioni non disponibile',
      panes: ['Guasto nascosto', 'Degradazione controllata'],
      diagram,
      steps: [
        {
          kind: 'message',
          role: 'user',
          pane: 0,
          text: 'Dov’è il mio ordine A-101?',
          path: ['main', 'ship'],
        },
        {
          kind: 'message',
          role: 'assistant',
          pane: 0,
          text: 'Non risultano spedizioni per l’ordine A-101.',
          note: 'Sembra una risposta, ma il servizio non ha mai risposto.',
        },
        {
          kind: 'message',
          role: 'user',
          pane: 1,
          text: 'Dov’è il mio ordine A-101?',
          path: ['main', 'orders', 'main', 'ship'],
        },
        {
          kind: 'message',
          role: 'assistant',
          pane: 1,
          text: 'L’ordine A-101 risulta spedito. In questo momento non riesco a consultare il corriere, quindi non posso indicare la data di consegna. Può riprovare più tardi.',
          path: ['orders', 'main'],
          observe: [1],
        },
      ],
    },
    {
      id: 'escalation',
      label: '3. Persona nel ciclo',
      simulator: 'code',
      source: 'esempio',
      title: 'rimborso sopra il limite',
      steps: [
        {
          kind: 'tool',
          name: 'rimborsa',
          input: 'A-67890, 149,99 euro',
          result: 'Sopra il limite automatico di 100,00 euro: serve l’approvazione di una persona',
          status: 'blocked',
          note: 'È il codice a fermare l’azione, non una frase nel prompt.',
        },
        {
          kind: 'table',
          columns: ['Campo', 'Passaggio all’operatore'],
          rows: [
            ['Cliente', 'Jane Doe, ID 12345'],
            ['Problema', 'prodotto arrivato danneggiato'],
            ['Azioni fatte', 'foto ricevute, rimborso automatico bloccato'],
            ['Consigliato', 'approvare 149,99 euro'],
          ],
          observe: [2],
        },
        { kind: 'permission', question: 'Operatore: approvi il rimborso?', options: ['Sì', 'No'], choice: 0 },
      ],
    },
    {
      id: 'sla',
      label: '4. SLA',
      simulator: 'terminal',
      source: 'esempio',
      title: 'tempo reale o batch?',
      steps: [
        {
          kind: 'table',
          columns: ['SLA', 'Scelta'],
          rows: [
            ['risposta in chat entro 10 secondi', 'tempo reale'],
            ['report entro lunedì mattina', 'batch nel fine settimana'],
            ['risposta garantita entro 4 ore', 'tempo reale o coda: il batch può arrivare a 24 ore'],
          ],
          highlight: [2],
          observe: [3],
          note: 'Il batch spesso finisce molto prima, ma uno SLA si progetta sul tempo massimo.',
        },
      ],
    },
  ],
};
