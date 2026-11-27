import { box, code, frame, note, scene } from '../helpers';
import type { Lesson } from '../types';

export const d2Tools: Lesson = {
  id: 'd2-strumenti',
  group: 'd2',
  code: 'D2·1',
  title: 'Progettare gli strumenti',
  lesson: 'Dominio 2 · Parte 1 · Progettare gli strumenti',
  goal: 'Capire come Claude sceglie uno strumento, come descriverlo bene e quanti strumenti dare a ogni agente.',
  exam: 'La description è il criterio di selezione; al massimo 4–5 strumenti per agente; any garantisce una chiamata, tool ne forza una precisa.',
  scenes: [
    scene({
      id: 'description',
      label: 'La descrizione decide',
      description: 'Claude legge solo nome e descrizione degli strumenti per scegliere quale usare.',
      takeaway:
        'La description non è documentazione: è l’unica cosa che Claude legge per decidere quale strumento chiamare e quando.',
      actors: [
        box('q', 'Cliente', 12, 50, { w: 18, body: '«dove trovo la guida al reso?»' }),
        box('claude', 'Claude', 40, 50, { w: 18, body: 'sceglie lo strumento' }),
        code('bad', 'search', '"Cerca elementi"', 80, 20, { w: 30, from: 1 }),
        code(
          'good',
          'search_knowledge_base',
          '"Cerca articoli di supporto, FAQ\ne guide nella knowledge base.\nUsalo quando il cliente fa una\ndomanda già documentata."',
          80,
          66,
          { w: 36, from: 1 },
        ),
        box('list', 'I 5 punti della descrizione', 32, 86, {
          w: 44,
          from: 5,
          body: 'scopo · input · output · casi limite · quando usarlo al posto di uno simile',
        }),
      ],
      links: [
        ['q', 'claude'],
        ['claude', 'bad'],
        ['claude', 'good'],
      ],
      frames: [
        frame('Una domanda del cliente arriva a Claude, che ha degli strumenti a disposizione.', {
          hot: ['q', 'claude'],
        }),
        frame(
          'Claude non vede il codice degli strumenti. Vede solo il nome e la descrizione che hai scritto.',
          {
            hot: ['claude'],
          },
        ),
        frame('Un nome generico e una descrizione vaga: Claude non sa quando usarlo.', {
          hot: ['bad'],
          set: { bad: { mark: 'no' } },
        }),
        frame('Un nome chiaro e una descrizione che dice a cosa serve e quando usarlo.', {
          hot: ['good'],
          flows: [['claude', 'good', 'scelto']],
          set: { good: { mark: 'ok' } },
        }),
        frame(
          'Se due strumenti si somigliano (analizza contenuti, analizza documento), Claude li confonde: rinominali o uniscili.',
          {
            hot: ['claude'],
          },
        ),
        frame('Una buona descrizione risponde a cinque domande.', { hot: ['list'] }),
      ],
    }),
    scene({
      id: 'quanti',
      label: 'Quanti strumenti',
      description:
        'Un agente con troppi strumenti sbaglia scelta; meglio distribuirli tra agenti specializzati.',
      takeaway: 'Al massimo 4–5 strumenti per agente: il resto va distribuito tra subagenti specializzati.',
      actors: [
        box('big', 'Un agente, 18 strumenti', 50, 30, {
          w: 50,
          until: 2,
          body: 'sceglie quello sbagliato, ne chiama di inutili, fatica a decidere',
        }),
        box('coord', 'Coordinatore', 50, 14, { w: 24, body: 'Agent, AskUser', from: 3 }),
        box('r', 'Ricerca', 18, 62, { w: 26, from: 3, body: 'search_web\nsearch_docs\nsearch_db' }),
        box('a', 'Analisi', 50, 62, { w: 26, from: 3, body: 'analyze_text\nextract_entities\nsummarize' }),
        box('o', 'Operativo', 82, 62, { w: 26, from: 3, body: 'send_email\ncreate_ticket\nupdate_record' }),
        note('rule', 'Regola', 50, 90, { w: 50, from: 4, body: '4–5 strumenti per agente, non di più' }),
      ],
      links: [
        ['coord', 'r'],
        ['coord', 'a'],
        ['coord', 'o'],
      ],
      frames: [
        frame('Dare a un solo agente tutti gli strumenti sembra comodo.', { hot: ['big'] }),
        frame('Con 18 strumenti Claude fatica a scegliere: sbaglia strumento o ne chiama di inutili.', {
          hot: ['big'],
          set: { big: { mark: 'no' } },
        }),
        frame('Meglio dividere il lavoro per ruolo.', { hot: ['big'] }),
        frame('Un coordinatore e tre subagenti, ognuno con pochi strumenti ben distinti.', {
          hot: ['coord', 'r', 'a', 'o'],
        }),
        frame('La regola pratica: al massimo quattro o cinque strumenti per agente.', { hot: ['rule'] }),
      ],
    }),
    scene({
      id: 'tool-choice',
      label: 'tool_choice e strict',
      description:
        'Come si guida Claude a usare uno strumento, e come si garantisce che i dati abbiano la forma giusta.',
      takeaway:
        'auto lascia libero Claude, any lo obbliga a usare uno strumento, tool ne impone uno preciso, none vieta gli strumenti. strict garantisce lo schema.',
      actors: [
        box('auto', 'auto', 16, 18, { w: 24, body: 'Claude sceglie se usare\nuno strumento o rispondere' }),
        box('any', 'any', 50, 18, { w: 24, body: 'deve usare uno strumento,\nsceglie lui quale', from: 1 }),
        box('tool', 'tool + nome', 84, 18, {
          w: 24,
          body: 'deve usare esattamente\nquello indicato',
          from: 2,
        }),
        box('none', 'none', 16, 50, { w: 24, body: 'nessuno strumento:\nsolo testo', from: 3 }),
        code('strict', 'strict: true', '"additionalProperties": false\n"required": [tutti i campi]', 62, 66, {
          w: 44,
          from: 4,
        }),
        box('use', 'Quando', 50, 90, {
          w: 90,
          from: 2,
          body: 'any: output strutturato tra più schemi  ·  tool: forzare un’operazione come primo passo',
        }),
      ],
      frames: [
        frame('tool_choice dice a Claude quanta libertà ha. Il valore predefinito è auto.', {
          hot: ['auto'],
        }),
        frame(
          'any: Claude deve chiamare uno strumento. Utile quando si vuole sempre un output strutturato.',
          {
            hot: ['any'],
          },
        ),
        frame(
          'tool con un nome: Claude deve chiamare proprio quello, per esempio come primo passo obbligato.',
          {
            hot: ['tool', 'use'],
          },
        ),
        frame('none: nessuno strumento. Si usa per un riepilogo finale senza togliere le definizioni.', {
          hot: ['none'],
        }),
        frame(
          'Con strict: true i dati rispettano lo schema: niente campi extra, tutti i campi obbligatori presenti.',
          {
            hot: ['strict'],
            set: { strict: { mark: 'ok' } },
          },
        ),
      ],
    }),
  ],
};
