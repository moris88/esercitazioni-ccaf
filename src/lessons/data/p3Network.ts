import { box, code, frame, scene } from '../helpers';
import type { Lesson } from '../types';

export const p3Network: Lesson = {
  id: 'p3-reti',
  group: 'pre',
  code: 'P·3',
  title: 'Reti e API',
  lesson: 'Pre-corso · Reti e API',
  goal: 'Leggere una richiesta HTTP e decidere, dal codice di stato, se riprovare, correggere o fermarsi.',
  exam: 'Errore temporaneo o permanente; chiave di idempotenza per i rimborsi; batch solo se nessuno aspetta.',
  scenes: [
    scene({
      id: 'http',
      label: 'Richiesta e risposta',
      description: 'Un programma chiede qualcosa a un servizio e il codice di stato dice com’è andata.',
      takeaway:
        '2xx è andata bene; 4xx è un errore di chi chiede (correggi); 5xx è un errore del servizio (riprova); 429 chiede di rallentare.',
      actors: [
        box('c', 'Il tuo programma', 14, 40, { w: 22, body: 'client' }),
        box('s', 'Servizio', 86, 40, { w: 22, body: 'API' }),
        box('r2', '2xx', 24, 82, { w: 16, from: 2, body: 'ok' }),
        box('r4', '4xx', 44, 82, { w: 16, from: 3, body: 'tua colpa:\ncorreggi' }),
        box('r5', '5xx', 64, 82, { w: 16, from: 4, body: 'del servizio:\nriprova' }),
        box('r429', '429', 84, 82, { w: 16, from: 5, body: 'troppe richieste:\naspetta' }),
      ],
      links: [
        ['c', 's'],
        ['s', 'c'],
      ],
      frames: [
        frame(
          'Il programma manda una richiesta HTTP: un verbo (GET, POST), un indirizzo e, se serve, dei dati.',
          {
            hot: ['c'],
            flows: [['c', 's', 'GET /ordini/1001']],
          },
        ),
        frame('Il servizio risponde con un codice di stato e dei dati.', {
          hot: ['s'],
          flows: [['s', 'c', '200 + dati']],
        }),
        frame('200 e simili: è andata bene.', { hot: ['r2'] }),
        frame('400, 404: l’errore è nella richiesta. Ritentare uguale non serve: va corretta.', {
          hot: ['r4'],
        }),
        frame('500, 503: il problema è del servizio, spesso temporaneo. Ha senso riprovare.', {
          hot: ['r5'],
        }),
        frame('429: troppe richieste. Si aspetta e si riprova più tardi.', { hot: ['r429'] }),
      ],
    }),
    scene({
      id: 'idempotenza',
      label: 'Retry e idempotenza',
      description:
        'Un rimborso viene ritentato dopo un timeout: senza protezione, il cliente potrebbe essere rimborsato due volte.',
      takeaway:
        'Riprovare è sicuro solo se l’operazione è idempotente: una chiave unica fa sì che lo stesso rimborso non venga eseguito due volte.',
      actors: [
        box('c', 'Il tuo programma', 14, 30, { w: 22 }),
        box('s', 'Servizio rimborsi', 84, 30, { w: 24 }),
        code('key', 'Chiave di idempotenza', 'Idempotency-Key: rimb-8841', 50, 66, { w: 36, from: 4 }),
        box('twice', 'Rimborsato 2 volte', 22, 88, {
          w: 30,
          from: 3,
          mark: 'no',
          body: '100 euro invece di 50',
        }),
        box('once', 'Rimborsato 1 volta', 74, 88, {
          w: 30,
          from: 5,
          mark: 'ok',
          body: 'la richiesta ripetuta è riconosciuta',
        }),
      ],
      links: [
        ['c', 's'],
        ['key', 's'],
      ],
      frames: [
        frame('Il programma chiede un rimborso di 50 euro.', {
          hot: ['c'],
          flows: [['c', 's', 'rimborsa 50 €']],
        }),
        frame('Il servizio lo esegue, ma la risposta si perde: per il programma è un timeout.', {
          hot: ['s'],
          flows: [['s', 'c', '…nessuna risposta']],
        }),
        frame('Il programma, per sicurezza, riprova la stessa richiesta.', {
          hot: ['c'],
          flows: [['c', 's', 'rimborsa 50 €']],
        }),
        frame('Senza protezione il rimborso viene eseguito due volte.', { hot: ['twice'] }),
        frame('La soluzione: una chiave unica, mandata con ogni tentativo.', { hot: ['key'] }),
        frame(
          'Il servizio vede la stessa chiave, capisce che è un tentativo ripetuto e non rimborsa di nuovo.',
          {
            hot: ['once', 'key'],
            flows: [['key', 's', 'rimb-8841']],
          },
        ),
      ],
    }),
    scene({
      id: 'webhook',
      label: 'Webhook e batch',
      description:
        'Due modi di lavorare con i servizi: aspettare un avviso o mandare tanto lavoro tutto insieme.',
      takeaway:
        'Un webhook è il servizio che avvisa te; il batch si usa solo quando nessuno aspetta la risposta.',
      actors: [
        box('s', 'Servizio', 14, 22, { w: 20 }),
        box('r', 'Il tuo ricevitore', 56, 22, { w: 26, from: 1, body: 'riceve e conferma' }),
        box('ev', 'Evento', 90, 22, { w: 14, from: 1 }),
        box('b1', 'Batch', 24, 70, {
          w: 30,
          from: 3,
          body: 'tanto lavoro insieme\ncosta meno, tempi lunghi',
        }),
        box('b2', 'Tempo reale', 70, 70, {
          w: 30,
          from: 4,
          body: 'una persona aspetta\nrisposta subito',
          mark: 'ok',
        }),
      ],
      links: [['s', 'r']],
      frames: [
        frame('Di solito sei tu a chiedere al servizio. Un webhook funziona al contrario.', { hot: ['s'] }),
        frame(
          'Quando succede qualcosa (un pagamento riuscito), il servizio chiama il tuo indirizzo e ti avvisa.',
          {
            hot: ['r'],
            flows: [['s', 'r', 'pagamento ok']],
          },
        ),
        frame('Il tuo ricevitore risponde subito, così il servizio sa che hai ricevuto l’avviso.', {
          hot: ['r'],
        }),
        frame('Un batch invece raggruppa molte richieste: costa meno ma i tempi sono lunghi.', {
          hot: ['b1'],
        }),
        frame('Se una persona aspetta la risposta, si usa il tempo reale, non il batch.', { hot: ['b2'] }),
      ],
    }),
  ],
};
