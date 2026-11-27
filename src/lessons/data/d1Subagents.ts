import { box, code, frame, note, scene } from '../helpers';
import type { Lesson } from '../types';

export const d1Subagents: Lesson = {
  id: 'd1-subagenti',
  group: 'd1',
  code: 'D1·2',
  title: 'Coordinatore e subagenti',
  lesson: 'Dominio 1 · Parte 2 · Coordinatore e subagenti',
  goal: 'Vedere come un coordinatore divide il lavoro, perché i subagenti non ereditano il contesto e quando si usa il parallelo o il fork.',
  exam: 'Hub-and-spoke; il contesto va passato esplicitamente; parallelo = più chiamate Agent nella stessa risposta.',
  scenes: [
    scene({
      id: 'hub',
      label: 'Hub-and-spoke',
      description: 'Un coordinatore al centro assegna il lavoro a tre subagenti e raccoglie i risultati.',
      takeaway:
        'I subagenti non parlano mai tra loro: ogni messaggio passa dal coordinatore, che scompone, delega, aggrega e controlla la copertura.',
      actors: [
        box('coord', 'Coordinatore', 50, 20, { w: 24, body: 'scompone, delega,\naggrega' }),
        box('s1', 'Subagente', 16, 72, { w: 22, body: 'Ricerca', from: 1 }),
        box('s2', 'Subagente', 50, 72, { w: 22, body: 'Analisi', from: 1 }),
        box('s3', 'Subagente', 84, 72, { w: 22, body: 'Sintesi', from: 1 }),
        note('gap', 'Lacuna trovata', 84, 20, { w: 24, body: 'manca la musica', from: 5 }),
      ],
      links: [
        ['coord', 's1'],
        ['coord', 's2'],
        ['coord', 's3'],
        ['s1', 'coord'],
        ['s2', 'coord'],
        ['s3', 'coord'],
      ],
      frames: [
        frame('Una richiesta ampia arriva al coordinatore: «ricerca sulle industrie creative».', {
          hot: ['coord'],
        }),
        frame(
          'Il coordinatore la scompone e sceglie i subagenti giusti. Non serve usarli tutti ogni volta.',
          {
            hot: ['coord', 's1', 's2', 's3'],
          },
        ),
        frame('Delega: ogni subagente riceve la sua parte di lavoro.', {
          hot: ['s1', 's2'],
          flows: [
            ['coord', 's1', 'cerca'],
            ['coord', 's2', 'analizza'],
          ],
        }),
        frame('I risultati tornano al coordinatore. I subagenti non si scambiano nulla direttamente.', {
          hot: ['coord'],
          flows: [
            ['s1', 'coord', 'fonti'],
            ['s2', 'coord', 'analisi'],
          ],
          set: { s1: { mark: 'ok' }, s2: { mark: 'ok' } },
        }),
        frame(
          'Errore classico: il coordinatore aveva diviso solo in «arti visive» e ha lasciato fuori musica, scrittura, cinema e design.',
          { hot: ['coord'], set: { coord: { mark: 'no' } } },
        ),
        frame('Il coordinatore valuta la sintesi, trova la lacuna e lancia un secondo giro mirato.', {
          hot: ['gap', 's3'],
          flows: [['coord', 's3', 'colma la lacuna']],
          set: { coord: { mark: 'ok' } },
        }),
      ],
    }),
    scene({
      id: 'contesto',
      label: 'Il contesto non si eredita',
      description: 'Un subagente parte da zero: sa solo ciò che il coordinatore scrive nel suo prompt.',
      takeaway:
        'Un subagente riceve solo ciò che gli passi: scrivi tutto nel prompt, in forma completa e strutturata, con contenuto e fonti separati.',
      actors: [
        box('coord', 'Coordinatore', 17, 28, { w: 26, body: 'conosce il cliente,\nl’ordine, la storia' }),
        code('bad', 'Prompt vago', '«Analizza il problema\ndel cliente»', 50, 28, {
          w: 26,
          from: 1,
          until: 3,
        }),
        box('sub', 'Subagente', 84, 28, { w: 24, body: 'parte da zero' }),
        code(
          'good',
          'Prompt completo',
          'Cliente 12345, ordine 67890\n(2024-01-15, 149,99 $)\nArrivato danneggiato.\nChiede rimborso completo.',
          50,
          28,
          { w: 32, from: 4 },
        ),
        code(
          'struct',
          'Risultato strutturato',
          '{ "claim": "Ricavi +15%",\n  "source_url": "…",\n  "document_name": "Q4 2024",\n  "publication_date": "2025-01-15" }',
          50,
          78,
          { w: 44, from: 6 },
        ),
      ],
      links: [
        ['coord', 'bad'],
        ['bad', 'sub'],
        ['coord', 'good'],
        ['good', 'sub'],
      ],
      frames: [
        frame(
          'Il coordinatore ha seguito tutta la conversazione: sa chi è il cliente e che cosa è successo.',
          {
            hot: ['coord'],
          },
        ),
        frame('Poi delega con una frase vaga.', { hot: ['bad'], flows: [['coord', 'sub']] }),
        frame('Il subagente non ha la cronologia: non sa chi sia il cliente né quale sia il problema.', {
          hot: ['sub'],
          set: { sub: { mark: 'no', body: 'non sa di cosa si parla' } },
        }),
        frame('Il contesto non si eredita e non si può rimandare a «quanto detto prima».', {
          hot: ['sub', 'coord'],
        }),
        frame('La correzione: scrivere nel prompt tutto ciò che serve, con numeri e date esatti.', {
          hot: ['good'],
          flows: [['coord', 'sub']],
          set: { sub: { mark: 'ok', body: 'ha tutto ciò che serve' } },
        }),
        frame('Lo stesso vale al ritorno: il subagente restituisce risultati e fonti, non solo una frase.', {
          hot: ['sub'],
        }),
        frame(
          'Contenuto e metadati restano separati: affermazione, prove, fonte e data. Così si conserva l’attribuzione.',
          { hot: ['struct'], flows: [['sub', 'struct']] },
        ),
      ],
    }),
    scene({
      id: 'parallelo',
      label: 'Parallelo e fork',
      description:
        'Due modi di avviare più subagenti insieme, e la differenza tra un subagente nuovo e un fork.',
      takeaway:
        'Parallelo = più chiamate Agent nella stessa risposta. Il fork eredita tutta la conversazione e condivide la cache; il subagente nuovo no.',
      actors: [
        box('coord', 'Coordinatore', 50, 14, { w: 26 }),
        code('one', 'Una sola risposta', 'Agent → cerca articoli\nAgent → analizza documento', 50, 46, {
          w: 36,
          from: 1,
          until: 2,
        }),
        box('a', 'Subagente A', 22, 82, { w: 22, from: 1, until: 2, body: 'in contemporanea' }),
        box('b', 'Subagente B', 78, 82, { w: 22, from: 1, until: 2, body: 'in contemporanea' }),
        box('turns', 'Turni separati', 50, 46, {
          w: 36,
          from: 3,
          until: 3,
          body: 'una chiamata per risposta',
          mark: 'no',
        }),
        box('new', 'Subagente nuovo', 24, 40, {
          w: 34,
          from: 4,
          body: 'cronologia: non ereditata\ncache: fredda\nper compiti circoscritti',
        }),
        box('fork', 'Fork', 76, 40, {
          w: 34,
          from: 4,
          body: 'cronologia: ereditata\ncache: condivisa, costa meno\nper rami divergenti',
        }),
        box('cmd', 'Comandi', 50, 84, {
          w: 74,
          from: 5,
          body: '/subtask  ·  /fork  ·  /branch — in entrambi i casi torna solo il risultato finale',
        }),
      ],
      links: [
        ['coord', 'one'],
        ['one', 'a'],
        ['one', 'b'],
      ],
      frames: [
        frame('Il coordinatore deve cercare e analizzare: due attività indipendenti.', { hot: ['coord'] }),
        frame('Per farle insieme emette due chiamate Agent nella stessa risposta.', {
          hot: ['one'],
          flows: [['coord', 'one', '2 × Agent']],
        }),
        frame('I due subagenti lavorano in contemporanea e il tempo totale si riduce.', {
          hot: ['a', 'b'],
          flows: [
            ['one', 'a'],
            ['one', 'b'],
          ],
        }),
        frame('Se invece le chiamate arrivano in turni separati, l’esecuzione diventa una dopo l’altra.', {
          hot: ['turns'],
        }),
        frame('Subagente nuovo o fork? Il nuovo parte da zero; il fork eredita tutta la conversazione.', {
          hot: ['new', 'fork'],
        }),
        frame(
          'Il fork condivide la cache con la sessione madre, quindi costa meno. Torna solo il risultato; i fork non avviano altri fork.',
          { hot: ['cmd', 'fork'] },
        ),
      ],
    }),
  ],
};
