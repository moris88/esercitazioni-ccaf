import type { Exercise } from '../types';

const ATTACHMENT = 'email_supporto.txt (8 email)';

export const d4Criteria: Exercise = {
  id: 'd4-1',
  code: 'D4·1',
  lesson: 'Criteri espliciti e few-shot',
  title: 'Dal prompt vago ai criteri con esempi',
  place: 'Claude (app o claude.ai)',
  minutes: 10,
  goal: 'Confrontare una classificazione con istruzioni vaghe e una con criteri espliciti ed esempi.',
  observe: [
    'Con il prompt vago l’urgenza segue il tono: i punti esclamativi alzano la priorità.',
    'Con i criteri l’email 3 (doppio addebito) e la 7 (account bloccato) sono alte, la 1 no.',
    'L’email 4 (rimborso più spedizione) è gestita come dicono le regole, grazie al caso limite esplicito.',
    'Gli esempi contengono il motivo: insegnano lo schema, non solo la risposta.',
  ],
  exam: 'Criteri: cosa rientra, cosa è escluso, esempi con il ragionamento; 2-4 esempi mirati.',
  scenes: [
    {
      id: 'email',
      label: '1. Le 8 email',
      description:
        'Le otto email di supporto usate nell’esercizio. Leggetele prima di vedere come le classifica Claude.',
      simulator: 'chat',
      source: 'kit',
      title: 'email_supporto.txt',
      steps: [
        {
          kind: 'table',
          columns: ['N.', 'Email'],
          rows: [
            ['1', 'Il pacco è arrivato con lo schermo rotto, voglio i soldi indietro.'],
            ['2', "Posso cambiare l'indirizzo di consegna dell'ordine di ieri?"],
            ['3', 'Mi avete addebitato due volte lo stesso ordine!!!'],
            [
              '4',
              'Il prodotto funziona ma la consegna è arrivata in ritardo di una settimana: vorrei un rimborso parziale e sapere quando arriva il secondo pacco.',
            ],
            ['5', 'Come si collega la stampante al Wi-Fi?'],
            ['6', 'Avete ancora il modello X200 in magazzino?'],
            ['7', 'Il mio account è bloccato e non riesco a vedere le fatture.'],
            ['8', 'Ottimo servizio, grazie!'],
          ],
          note: 'Domanda al team: quali sono davvero urgenti? Votate prima di andare avanti.',
        },
      ],
    },
    {
      id: 'confronto',
      label: '2. Vago contro criteri',
      description:
        'Le stesse email in due chat. A sinistra la richiesta è generica, a destra ci sono criteri ed esempi: confrontate la colonna urgenza.',
      simulator: 'chat',
      source: 'esempio',
      title: 'due chat nuove',
      panes: ['Chat 1 · istruzione vaga', 'Chat 2 · criteri ed esempi'],
      steps: [
        {
          kind: 'message',
          role: 'user',
          pane: 0,
          attachment: ATTACHMENT,
          text: 'Classifica queste email di supporto per urgenza, usando il tuo miglior giudizio.',
        },
        {
          kind: 'table',
          pane: 0,
          columns: ['N.', 'Urgenza', 'Motivo'],
          rows: [
            ['1', 'ALTA', 'cliente scontento'],
            ['2', 'MEDIA', 'ordine recente'],
            ['3', 'ALTA', 'cliente molto arrabbiato'],
            ['4', 'MEDIA', 'lamentela'],
            ['5', 'BASSA', 'informazione'],
            ['6', 'BASSA', 'informazione'],
            ['7', 'MEDIA', 'tono tranquillo'],
            ['8', 'BASSA', 'complimento'],
          ],
          highlight: [0, 6],
          observe: [0],
          note: 'La 1 sale e la 7 scende: il criterio implicito è il tono, e può cambiare a ogni prova.',
        },
        {
          kind: 'message',
          role: 'user',
          pane: 1,
          attachment: ATTACHMENT,
          text: `Classifica ogni email in una sola categoria: RIMBORSO, SPEDIZIONE, ACCOUNT, TECNICO, ALTRO.
Urgenza ALTA solo se c'è un addebito errato o un account bloccato. NON è alta solo perché il tono è arrabbiato.
Se un'email chiede due cose, usa la categoria della richiesta economica e segnala l'altra in nota.

Esempi:
"Il pacco è arrivato rotto, voglio i soldi indietro" -> RIMBORSO, urgenza MEDIA (danno, ma nessun addebito errato)
"Ottimo servizio" -> ALTRO, urgenza BASSA (nessuna azione richiesta)

Rispondi con una tabella: numero, categoria, urgenza, motivo.`,
          observe: [3],
          note: 'Cosa rientra, cosa è escluso, il caso limite e due esempi con il motivo.',
        },
        {
          kind: 'table',
          pane: 1,
          columns: ['N.', 'Categoria', 'Urgenza', 'Motivo'],
          rows: [
            ['1', 'RIMBORSO', 'MEDIA', 'danno, nessun addebito errato'],
            ['2', 'SPEDIZIONE', 'BASSA', 'cambio indirizzo'],
            ['3', 'RIMBORSO', 'ALTA', 'doppio addebito'],
            ['4', 'RIMBORSO', 'MEDIA', 'rimborso parziale; nota: secondo pacco'],
            ['5', 'TECNICO', 'BASSA', 'configurazione Wi-Fi'],
            ['6', 'ALTRO', 'BASSA', 'disponibilità prodotto'],
            ['7', 'ACCOUNT', 'ALTA', 'account bloccato'],
            ['8', 'ALTRO', 'BASSA', 'nessuna azione richiesta'],
          ],
          highlight: [2, 3, 6],
          observe: [1, 2],
          note: 'Alte solo la 3 e la 7, per un motivo verificabile. La 4 segue il caso limite.',
        },
      ],
    },
  ],
};
