import type { Diagram, Exercise } from '../types';

const diagram: Diagram = {
  nodes: [
    { id: 'client', label: 'Cliente', x: 62, y: 40 },
    { id: 'policy', label: 'Policy', x: 258, y: 40 },
    { id: 'solve', label: 'Risolve', x: 62, y: 175 },
    { id: 'human', label: 'Operatore', x: 258, y: 175 },
  ],
  edges: [
    { from: 'client', to: 'policy' },
    { from: 'policy', to: 'client' },
    { from: 'policy', to: 'solve' },
    { from: 'policy', to: 'human' },
  ],
};

export const d5Escalation: Exercise = {
  id: 'd5-2',
  code: 'D5·2',
  lesson: 'Escalation ed errori',
  title: 'L’agente di supporto: quando passare la mano',
  place: 'Claude (app o claude.ai)',
  minutes: 10,
  goal: 'Mettere alla prova una policy di escalation con casi in cui il tono e la complessità non coincidono.',
  observe: [
    'Caso 1: l’agente risolve lo storno, nonostante le maiuscole.',
    'Caso 2: escalation con un riepilogo strutturato, nonostante il tono tranquillo.',
    'Caso 3: chiede un dato identificativo invece di scegliere un account.',
  ],
  exam: 'Emozione ≠ complessità; più corrispondenze: chiedi; escalation con riepilogo strutturato.',
  scenes: [
    {
      id: 'policy',
      label: '1. La policy',
      simulator: 'chat',
      source: 'esempio',
      title: 'nuova chat',
      diagram,
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: `Sei l'agente di supporto di un negozio online. Regole:
- Passa a un operatore SOLO se: il cliente lo chiede esplicitamente; la richiesta non è coperta dalle policy; non fai progressi dopo due tentativi.
- Il tono arrabbiato NON è un motivo di escalation.
- Se trovi più clienti con lo stesso nome, chiedi email o ultime 4 cifre del telefono. Non indovinare.
- Puoi stornare da solo gli addebiti duplicati fino a 50 euro.
- Quando passi a un operatore, scrivi un riepilogo: cliente, problema, ordine, azioni fatte, azione consigliata.
Rispondi ai prossimi messaggi come se fossero del cliente. Clienti in archivio: Mario Rossi (mario.r@mail.it), Mario Rossi (rossi.m@mail.it).`,
          path: ['policy'],
          note: 'Tre condizioni precise, un’esclusione e un limite in euro.',
        },
        { kind: 'message', role: 'assistant', text: 'Pronto: rispondo come agente di supporto.' },
      ],
    },
    {
      id: 'caso-1',
      label: '2. Tono acceso',
      simulator: 'chat',
      source: 'esempio',
      title: 'caso 1',
      diagram,
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: 'SONO FURIOSO!!! Mi avete addebitato DUE VOLTE 4,99 euro per lo stesso ordine!!!',
          path: ['client', 'policy'],
          note: 'Domanda al team: passereste la mano?',
        },
        {
          kind: 'message',
          role: 'assistant',
          text: 'Mi dispiace per il disagio. Un addebito duplicato di 4,99 euro rientra in quelli che posso stornare direttamente: procedo con lo storno. Mi indica il numero d’ordine per registrarlo?',
          path: ['policy', 'solve'],
          observe: [0],
        },
      ],
    },
    {
      id: 'caso-2',
      label: '3. Fuori policy',
      simulator: 'chat',
      source: 'esempio',
      title: 'caso 2',
      diagram,
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: 'Buongiorno, sono un’azienda: possiamo avere una fattura unica mensile con pagamento a 90 giorni per tutti gli ordini dei nostri 40 dipendenti?',
          path: ['client', 'policy'],
        },
        {
          kind: 'message',
          role: 'assistant',
          text: 'Buongiorno, questa richiesta non è coperta dalle policy che posso applicare: la passo a un operatore con questo riepilogo.',
          path: ['policy', 'human'],
        },
        {
          kind: 'table',
          columns: ['Campo', 'Riepilogo'],
          rows: [
            ['Cliente', 'azienda, 40 dipendenti (nome da raccogliere)'],
            ['Problema', 'fattura unica mensile, pagamento a 90 giorni'],
            ['Ordine', 'tutti gli ordini dei dipendenti'],
            ['Azioni fatte', 'nessuna: fuori policy'],
            ['Azione consigliata', 'valutazione commerciale'],
          ],
          observe: [1],
          note: 'L’operatore parte informato: il cliente non deve ripetere tutto.',
        },
      ],
    },
    {
      id: 'caso-3',
      label: '4. Stesso nome',
      simulator: 'chat',
      source: 'esempio',
      title: 'caso 3',
      diagram,
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: 'Sono Mario Rossi, mi dite a che punto è il mio ordine?',
          path: ['client', 'policy'],
        },
        {
          kind: 'message',
          role: 'assistant',
          text: 'Per trovare l’account corretto mi serve un dato in più: può indicarmi l’email o le ultime 4 cifre del telefono?',
          path: ['policy', 'client'],
          observe: [2],
          note: 'Indovinare mostrerebbe a una persona i dati di un’altra. E non elenca le email in archivio.',
        },
      ],
    },
  ],
};
