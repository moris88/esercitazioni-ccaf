import { box, code, frame, scene } from '../helpers';
import type { Lesson } from '../types';

export const d5Escalation: Lesson = {
  id: 'd5-escalation',
  group: 'd5',
  code: 'D5·2',
  title: 'Escalation ed errori',
  lesson: 'Dominio 5 · Parte 2 · Escalation ed errori',
  goal: 'Decidere quando passare un caso a una persona, come identificare il cliente giusto e come far arrivare gli errori con il loro contesto.',
  exam: 'Escalation se il cliente la chiede, c’è una lacuna o nessun progresso; emozione ≠ complessità; più account: chiedi; errori con contesto, retry locale.',
  scenes: [
    scene({
      id: 'quando',
      label: 'Quando passare a una persona',
      description: 'Due criteri giusti e tre motivi sbagliati per fare escalation.',
      takeaway:
        'Conta la complessità del caso, non il tono del cliente. Un addebito sbagliato da 5 dollari si risolve anche se il cliente urla.',
      actors: [
        box('yes', 'Sì, subito', 24, 20, {
          w: 36,
          body: 'il cliente chiede una persona\nlacuna nelle policy\nnessun progresso',
          mark: 'ok',
        }),
        box('no', 'Motivi sbagliati', 76, 20, {
          w: 36,
          from: 1,
          body: 'tono acceso\nbassa confidenza dichiarata\nconversazione lunga',
          mark: 'no',
        }),
        code(
          'loud',
          'Tono acceso',
          '«SONO DAVVERO FRUSTRATO!!!»\n+ semplice errore di fatturazione',
          24,
          62,
          { w: 40, from: 2 },
        ),
        code('calm', 'Tono calmo', '«Come interagisce il vostro SLA\ncon i requisiti UE sui dati?»', 76, 62, {
          w: 40,
          from: 3,
        }),
        box('r1', 'L’agente risolve', 24, 88, { w: 30, from: 4, mark: 'ok' }),
        box('r2', 'Possibile escalation', 76, 88, {
          w: 32,
          from: 4,
          body: 'complessità di policy',
          mark: 'ok',
        }),
      ],
      links: [
        ['loud', 'r1'],
        ['calm', 'r2'],
      ],
      frames: [
        frame(
          'Tre buoni motivi per passare a una persona: lo chiede il cliente, manca una regola, non si fa progressi.',
          {
            hot: ['yes'],
          },
        ),
        frame(
          'Tre motivi sbagliati: il tono, una confidenza dichiarata dal modello (poco affidabile) e la durata della conversazione.',
          {
            hot: ['no'],
          },
        ),
        frame('Cliente furioso ma problema semplice: un errore di fatturazione.', { hot: ['loud'] }),
        frame('Cliente calmissimo ma domanda complessa su contratti e normative.', { hot: ['calm'] }),
        frame(
          'Nel primo caso l’agente può risolvere; nel secondo conviene una persona. L’emozione non è complessità.',
          {
            hot: ['r1', 'r2'],
            flows: [
              ['loud', 'r1'],
              ['calm', 'r2'],
            ],
          },
        ),
      ],
    }),
    scene({
      id: 'omonimi',
      label: 'Più clienti con lo stesso nome',
      description: 'Quando la ricerca trova più corrispondenze, indovinare è pericoloso.',
      takeaway:
        'Più account? Chiedi un dato in più, non scegliere il più probabile. L’escalation porta un riepilogo strutturato.',
      actors: [
        box('search', 'Ricerca: «Mario Rossi»', 18, 26, { w: 28, body: '3 corrispondenze' }),
        box('guess', 'Scelgo il più probabile', 66, 20, {
          w: 32,
          from: 1,
          body: 'rischio di agire sull’account sbagliato',
          mark: 'no',
        }),
        code('ask', 'Chiedi', '«Mi indichi l’email o le ultime\nquattro cifre del telefono?»', 66, 54, {
          w: 42,
          from: 2,
        }),
        code(
          'sum',
          'Riepilogo dell’escalation',
          'Cliente: Jane Doe (n. 12345)\nProblema: rimborso, prodotto danneggiato\nAzioni: identità verificata, foto ricevute\nConsigliato: rimborso 149,99 $',
          36,
          84,
          { w: 56, from: 3 },
        ),
      ],
      frames: [
        frame('La ricerca restituisce tre clienti con lo stesso nome.', { hot: ['search'] }),
        frame('Scegliere con un’euristica quello «più probabile» può far agire sull’account sbagliato.', {
          hot: ['guess'],
        }),
        frame('Meglio chiedere al cliente un dato che distingua: l’email o le ultime cifre del telefono.', {
          hot: ['ask'],
        }),
        frame(
          'E se il caso va a una persona: un riepilogo con chi è, cosa è successo, cosa si è fatto e cosa consigliare.',
          {
            hot: ['sum'],
          },
        ),
      ],
    }),
    scene({
      id: 'propaga',
      label: 'Propagare un errore utile',
      description:
        'Un subagente incontra un timeout e lo gestisce da solo, oppure lo passa con tutto il contesto.',
      takeaway:
        'Si propaga solo ciò che il subagente non risolve, con cosa ha tentato, i risultati parziali e se si può riprovare. Mai soppressione silenziosa.',
      actors: [
        box('sub', 'Subagente', 14, 22, { w: 20, body: 'cerca «politica di reso»' }),
        box('to', 'Timeout', 46, 22, { w: 18, from: 1, body: 'errore temporaneo' }),
        box('retry', 'Retry locale', 76, 22, { w: 24, from: 2, body: 'attesa progressiva' }),
        box('coord', 'Coordinatore', 86, 62, { w: 22, from: 3, body: 'riceve i risultati' }),
        code(
          'err',
          'Errore con contesto',
          '"failure_type": "timeout"\n"attempted_query": "politica di reso"\n"partial_results": null\n"is_retryable": true\n"alternative_approaches": […]',
          28,
          70,
          { w: 50, from: 4 },
        ),
      ],
      links: [
        ['sub', 'to'],
        ['to', 'retry'],
        ['retry', 'coord'],
        ['err', 'coord'],
      ],
      frames: [
        frame('Un subagente cerca la politica di reso.', { hot: ['sub'] }),
        frame('La ricerca va in timeout: è un errore temporaneo.', { hot: ['to'], flows: [['sub', 'to']] }),
        frame('Prima prova a risolvere da solo: riprova con un’attesa crescente.', {
          hot: ['retry'],
          flows: [['to', 'retry']],
        }),
        frame('Se riesce, al coordinatore arrivano solo i risultati: nessuno deve occuparsi del problema.', {
          hot: ['coord'],
          flows: [['retry', 'coord', 'risultati']],
          set: { retry: { mark: 'ok' } },
        }),
        frame(
          'Se non riesce, propaga un errore completo: cosa ha tentato, cosa ha ottenuto, se si può riprovare e che alternative ci sono.',
          {
            hot: ['err', 'coord'],
            flows: [['err', 'coord', 'errore']],
            set: { retry: { mark: 'no' } },
          },
        ),
      ],
    }),
  ],
};
