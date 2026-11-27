import { box, code, frame, note, scene } from '../helpers';
import type { Lesson } from '../types';

export const d4Batch: Lesson = {
  id: 'd4-batch',
  group: 'd4',
  code: 'D4·3',
  title: 'Batch, revisione e cache',
  lesson: 'Dominio 4 · Parte 3 · Batch, revisione e cache',
  goal: 'Sapere quando usare il batch, perché la revisione va separata dalla scrittura e come far funzionare la cache del prompt.',
  exam: 'Batch: −50%, fino a 24 ore, abbina con custom_id; prima un campione, poi rinvia solo i falliti; chi genera non revisiona; cache: prima lo stabile, poi il variabile.',
  scenes: [
    scene({
      id: 'batch',
      label: 'Message Batches API',
      description: 'Un lavoro enorme e non urgente viene mandato in blocco, con un controllo prima e dopo.',
      takeaway:
        'Batch: −50%, fino a 24 ore, nessuna garanzia di tempo. Prima un campione, poi tutto; si rinviano solo le richieste fallite, abbinate con custom_id.',
      actors: [
        box('s1', '1 · Campione', 14, 24, { w: 22, body: 'perfeziona il prompt\nsu pochi documenti' }),
        box('s2', '2 · Batch', 40, 24, { w: 22, from: 1, body: '10.000 documenti\n−50%, fino a 24 ore' }),
        box('s3', '3 · Controlla', 66, 24, { w: 22, from: 2, body: 'chi è fallito?' }),
        box('s4', '4 · Rinvia', 90, 24, { w: 16, from: 3, body: 'solo i falliti' }),
        code(
          'id',
          'custom_id',
          'failed = [r.custom_id for r in results\n          if r.result.type == "errored"]',
          30,
          62,
          { w: 52, from: 4 },
        ),
        box('yes', 'Va bene per', 18, 88, { w: 26, from: 5, body: 'analisi notturne, audit' }),
        box('no', 'Non va bene per', 54, 88, {
          w: 32,
          from: 5,
          body: 'merge, tempo reale, più turni',
          mark: 'no',
        }),
      ],
      links: [
        ['s1', 's2'],
        ['s2', 's3'],
        ['s3', 's4'],
      ],
      frames: [
        frame('Prima di spedire diecimila documenti, si prova il prompt su un piccolo campione.', {
          hot: ['s1'],
        }),
        frame('Poi si invia tutto in un batch: costa la metà ma può richiedere fino a 24 ore.', {
          hot: ['s2'],
          flows: [['s1', 's2']],
        }),
        frame('A lavoro finito si controllano i risultati e si individuano le richieste fallite.', {
          hot: ['s3'],
          flows: [['s2', 's3']],
        }),
        frame('Si rinviano solo quelle, non l’intero batch.', { hot: ['s4'], flows: [['s3', 's4']] }),
        frame('Per riconoscerle si usa custom_id, mai la posizione nell’elenco.', { hot: ['id'] }),
        frame(
          'Il batch è adatto al lavoro non urgente; non per controlli bloccanti, tempo reale o conversazioni a più turni.',
          {
            hot: ['yes', 'no'],
          },
        ),
      ],
    }),
    scene({
      id: 'autorevisione',
      label: 'Il problema dell’autorevisione',
      description: 'Perché la stessa sessione non è la persona giusta per rivedere il proprio lavoro.',
      takeaway:
        'Chi genera non revisiona: una sessione nuova, senza le ragioni delle scelte. Per PR da 10 file in su: ogni file da solo, poi l’integrazione.',
      actors: [
        box('g', 'Sessione 1', 14, 30, { w: 22, body: 'genera il codice' }),
        note('bias', 'Stessa sessione', 14, 70, {
          w: 24,
          from: 1,
          body: 'ricorda perché ha scelto così: non mette in dubbio',
        }),
        box('new', 'Sessione nuova', 50, 30, { w: 24, from: 2, body: 'non conosce le ragioni' }),
        box('rev', 'Revisione', 84, 30, { w: 22, from: 3, body: 'trova più problemi', mark: 'ok' }),
        box('big', 'PR da 10 file in su', 50, 76, {
          w: 36,
          from: 4,
          body: 'passo 1: ogni file da solo\npasso 2: integrazione',
        }),
      ],
      links: [
        ['g', 'new'],
        ['new', 'rev'],
      ],
      frames: [
        frame('Una sessione di Claude scrive del codice.', { hot: ['g'] }),
        frame('Se la stessa sessione lo rivede, ricorda il perché di ogni scelta e tende a confermarla.', {
          hot: ['bias'],
          set: { bias: { mark: 'no' } },
        }),
        frame('Meglio una sessione completamente nuova, che non conosce quelle ragioni.', {
          hot: ['new'],
          flows: [['g', 'new', 'solo il codice']],
        }),
        frame('Vede il codice senza preconcetti e trova più problemi.', {
          hot: ['rev'],
          flows: [['new', 'rev']],
        }),
        frame(
          'Con una PR da dieci file in su: prima ogni file da solo, poi un passaggio sull’integrazione tra file.',
          {
            hot: ['big'],
          },
        ),
      ],
    }),
    scene({
      id: 'cache',
      label: 'La cache del prompt',
      description: 'Il prompt si legge dall’inizio: finché l’inizio non cambia, la cache funziona.',
      takeaway:
        'Prima lo stabile (strumenti, prompt di sistema), poi il variabile. Cache sempre a zero? Qualcosa cambia nel prefisso: controlla cache_read_input_tokens.',
      actors: [
        box('t', '1 · tools', 22, 14, { w: 30, body: 'in ordine deterministico' }),
        box('sys', '2 · system', 22, 40, { w: 30, from: 1, body: 'prompt fisso' }),
        box('msg', '3 · messages', 22, 66, {
          w: 30,
          from: 2,
          body: 'il variabile, dopo\nl’ultimo cache_control',
        }),
        box('cache', 'Cache', 62, 40, { w: 22, from: 3, body: 'prefisso identico:\nletto, non rielaborato' }),
        box('b1', 'Data nel system', 88, 14, { w: 20, from: 4, body: 'datetime.now()', mark: 'no' }),
        box('b2', 'JSON instabile', 88, 40, { w: 20, from: 4, body: 'chiavi in ordine casuale', mark: 'no' }),
        box('b3', 'ID nel prefisso', 88, 66, { w: 20, from: 4, body: 'sessione o utente', mark: 'no' }),
        code('chk', 'Controllo', 'usage.cache_read_input_tokens = 0', 50, 90, { w: 46, from: 5 }),
      ],
      links: [
        ['t', 'sys'],
        ['sys', 'msg'],
        ['sys', 'cache'],
      ],
      frames: [
        frame('Ogni richiesta ha un ordine: prima gli strumenti.', { hot: ['t'] }),
        frame('Poi il prompt di sistema, che deve restare uguale.', { hot: ['sys'] }),
        frame('Per ultimo ciò che cambia a ogni richiesta, i messaggi.', { hot: ['msg'] }),
        frame(
          'Se l’inizio è identico, la cache lo riconosce e non lo rielabora: più veloce e più economico.',
          {
            hot: ['cache'],
            flows: [['sys', 'cache', 'prefisso uguale']],
          },
        ),
        frame(
          'La cache si rompe se il prefisso cambia: una data, chiavi in ordine diverso, un ID di sessione.',
          {
            hot: ['b1', 'b2', 'b3'],
          },
        ),
        frame('Per accorgersene: se la cache risulta sempre a zero, qualcosa nel prefisso cambia.', {
          hot: ['chk'],
        }),
      ],
    }),
  ],
};
