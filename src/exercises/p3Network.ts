import type { Diagram, Exercise } from '../types';

const diagram: Diagram = {
  nodes: [
    { id: 'client', label: 'Client', x: 62, y: 100 },
    { id: 'server', label: 'Server', x: 258, y: 100 },
  ],
  edges: [
    { from: 'client', to: 'server' },
    { from: 'server', to: 'client' },
  ],
};

export const p3Network: Exercise = {
  id: 'p-3',
  code: 'P·3',
  lesson: 'Pre-corso · Reti e API',
  title: 'HTTP, retry, idempotenza e batch',
  place: 'Claude (app o claude.ai)',
  minutes: 10,
  goal: 'Leggere una richiesta HTTP e decidere, dal codice di stato, se riprovare, correggere o fermarsi.',
  observe: [
    '2xx è un successo, 4xx un errore di chi chiede, 5xx un errore del server.',
    'Si riprovano solo gli errori temporanei, aspettando sempre di più (backoff esponenziale).',
    'Dopo un timeout non si sa se l’azione è avvenuta: ripetere è sicuro solo se è idempotente.',
    'Lo stesso webhook può arrivare più volte: si risponde subito e si elabora una volta sola.',
    'La domanda da farsi per scegliere tra sincrono e batch: qualcuno sta aspettando la risposta?',
  ],
  exam: 'Errore temporaneo o permanente; chiave di idempotenza per i rimborsi; batch solo se nessuno aspetta.',
  scenes: [
    {
      id: 'http',
      label: '1. Richiesta e risposta',
      description:
        'Un programma chiede al server di creare un cliente: in alto la richiesta, sotto la risposta. La tabella spiega i codici più comuni.',
      simulator: 'terminal',
      source: 'esempio',
      title: 'API REST',
      diagram,
      steps: [
        {
          kind: 'output',
          text: 'POST /v1/clienti HTTP/1.1\nHost: api.esempio.it\nAuthorization: Bearer <chiave>\nContent-Type: application/json\n\n{ "nome": "Mario Rossi", "email": "mario@esempio.it" }',
          path: ['client', 'server'],
          note: 'Metodo, URL, header e body. La chiave non va mai scritta nel codice.',
        },
        {
          kind: 'output',
          text: 'HTTP/1.1 201 Created\nLocation: /v1/clienti/42\n\n{ "id": 42, "nome": "Mario Rossi", "email": "mario@esempio.it" }',
          tone: 'info',
          path: ['server', 'client'],
        },
        {
          kind: 'table',
          columns: ['Codice', 'Significato', 'Cosa fare'],
          rows: [
            ['200 / 201 / 204', 'riuscita', 'proseguire (204: nessun body)'],
            ['400', 'richiesta sbagliata', 'correggere, ripetere non serve'],
            ['401 / 403', 'non autenticato / autorizzato', 'controllare credenziali e permessi'],
            ['404', 'risorsa non trovata', 'verificare l’identificativo'],
            ['409', 'conflitto con lo stato', 'rileggere lo stato e decidere'],
            ['429', 'troppe richieste', 'aspettare e riprovare'],
            ['500 / 503', 'errore del server', 'riprovare più tardi'],
          ],
          highlight: [5, 6],
          observe: [0],
        },
      ],
    },
    {
      id: 'retry',
      label: '2. Retry e backoff',
      description:
        'Un programma riprova dopo un errore temporaneo, aspettando ogni volta di più. Nel secondo caso l’errore è permanente e non riprova.',
      simulator: 'terminal',
      source: 'esempio',
      title: 'client con retry',
      diagram,
      steps: [
        { kind: 'output', text: 'GET /ordini/A-101', path: ['client', 'server'] },
        {
          kind: 'output',
          text: '429 Too Many Requests → attendo 1 s',
          tone: 'error',
          path: ['server', 'client'],
        },
        { kind: 'output', text: '429 Too Many Requests → attendo 2 s', tone: 'error' },
        { kind: 'output', text: '503 Service Unavailable → attendo 4 s', tone: 'error' },
        { kind: 'output', text: '200 OK  {"stato": "spedito"}', tone: 'info', observe: [1] },
        { kind: 'divider', text: 'Un altro caso' },
        { kind: 'output', text: 'GET /ordini/ZZZ', path: ['client', 'server'] },
        {
          kind: 'output',
          text: '404 Not Found → nessun retry',
          tone: 'error',
          path: ['server', 'client'],
          note: 'Riprovare non farà comparire l’ordine: è un errore permanente.',
        },
      ],
    },
    {
      id: 'idempotenza',
      label: '3. Idempotenza',
      description:
        'Lo stesso rimborso ripetuto dopo un timeout. A sinistra viene pagato due volte, a destra una chiave evita il doppione.',
      simulator: 'terminal',
      source: 'esempio',
      title: 'rimborso di 50 euro',
      panes: ['Senza chiave', 'Con chiave di idempotenza'],
      diagram,
      steps: [
        {
          kind: 'output',
          pane: 0,
          text: 'POST /rimborsi  {"ordine": "A-101", "importo": 50}',
          path: ['client', 'server'],
        },
        { kind: 'output', pane: 0, text: 'timeout: nessuna risposta', tone: 'error' },
        { kind: 'output', pane: 0, text: 'retry → 201 Created', path: ['client', 'server'] },
        {
          kind: 'output',
          pane: 0,
          text: 'Saldo: rimborsati 100 euro',
          tone: 'error',
          observe: [2],
          note: 'La prima richiesta era riuscita: si era persa solo la risposta.',
        },
        {
          kind: 'output',
          pane: 1,
          text: 'POST /rimborsi\nIdempotency-Key: rimborso-A-101',
          path: ['client', 'server'],
        },
        { kind: 'output', pane: 1, text: 'timeout: nessuna risposta', tone: 'error' },
        { kind: 'output', pane: 1, text: 'retry con la stessa chiave', path: ['client', 'server'] },
        {
          kind: 'output',
          pane: 1,
          text: '→ risultato precedente\nSaldo: rimborsati 50 euro',
          tone: 'info',
          path: ['server', 'client'],
          note: 'Il servizio riconosce la chiave e non ripete l’azione.',
        },
      ],
    },
    {
      id: 'webhook',
      label: '4. Webhook',
      description:
        'Un servizio esterno avvisa il nostro sistema di un nuovo ticket. L’avviso arriva due volte, ma viene gestito una sola.',
      simulator: 'terminal',
      source: 'esempio',
      title: 'ricevitore di eventi',
      diagram,
      steps: [
        {
          kind: 'output',
          text: 'POST /webhook  {"evento": "ticket.creato", "ticket_id": "T-9001"}',
          path: ['client', 'server'],
          note: 'Qui è il servizio esterno a fare da client e a chiamare noi.',
        },
        {
          kind: 'output',
          text: 'firma verificata ✓ → 200 OK subito, lavoro messo in coda',
          tone: 'info',
          path: ['server', 'client'],
        },
        {
          kind: 'output',
          text: 'POST /webhook  {"evento": "ticket.creato", "ticket_id": "T-9001"}',
          path: ['client', 'server'],
        },
        {
          kind: 'output',
          text: 'T-9001 già gestito → 200 OK, nessuna azione',
          tone: 'info',
          path: ['server', 'client'],
          observe: [3],
        },
      ],
    },
    {
      id: 'batch',
      label: '5. Sincrono o batch',
      description:
        'Quattro situazioni da assegnare: risposta immediata o elaborazione in blocco. La tabella dà la soluzione.',
      simulator: 'terminal',
      source: 'esempio',
      title: 'quale scegliere?',
      steps: [
        {
          kind: 'output',
          text: '1. Utente in chat\n2. Controllo bloccante prima di unire una PR\n3. Analisi notturna di 50.000 documenti\n4. Ciclo con strumenti',
          note: 'Domanda al team: sincrono o batch?',
        },
        {
          kind: 'table',
          columns: ['Situazione', 'Scelta', 'Perché'],
          rows: [
            ['Utente in chat', 'sincrono', 'una persona aspetta'],
            ['Controllo prima della PR', 'sincrono', 'il merge è bloccato'],
            ['50.000 documenti di notte', 'batch', 'nessuno aspetta, costa circa la metà'],
            ['Ciclo con strumenti', 'sincrono', 'nel batch non si può rispondere in mezzo'],
          ],
          highlight: [2],
          observe: [4],
          note: 'Nel batch i risultati possono arrivare fino a 24 ore dopo e in ordine sparso: si abbinano con custom_id.',
        },
      ],
    },
  ],
};
