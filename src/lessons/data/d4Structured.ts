import { box, code, frame, note, scene } from '../helpers';
import type { Lesson } from '../types';

export const d4Structured: Lesson = {
  id: 'd4-output',
  group: 'd4',
  code: 'D4·2',
  title: 'Output strutturato e convalida',
  lesson: 'Dominio 4 · Parte 2 · Output strutturato e convalida',
  goal: 'Ottenere dati nella forma giusta, sapere cosa uno schema non garantisce e correggere gli errori con un ciclo di convalida.',
  exam: 'Tre strade: tool_use, strict, output_config.format; lo schema garantisce la forma, non il contenuto; null invece di inventare; retry con errori specifici.',
  scenes: [
    scene({
      id: 'tre-vie',
      label: 'Tre modi per avere JSON valido',
      description:
        'Il testo libero può rompersi; ci sono tre strade per costringere Claude a rispettare uno schema.',
      takeaway:
        'tool_use con schema, strict: true e output_config.format: tre strade verso un JSON conforme. Sui modelli più recenti si preferisce output_config.format.',
      actors: [
        box('free', 'Testo libero', 14, 24, {
          w: 22,
          body: 'JSON rotto, campi\nmancanti o sbagliati',
          mark: 'no',
        }),
        box('t1', '1 · tool_use + schema', 44, 24, {
          w: 28,
          from: 1,
          body: 'uno strumento descrive\nl’output; tool_choice forzato',
        }),
        box('t2', '2 · strict: true', 76, 24, { w: 24, from: 2, body: 'conformità garantita\nallo schema' }),
        code(
          't3',
          '3 · output_config.format',
          'output_config={"format": {\n  "type": "json_schema",\n  "schema": {…}\n}}',
          40,
          70,
          { w: 42, from: 3 },
        ),
        note('new', 'Modelli più recenti', 82, 70, {
          w: 28,
          from: 4,
          body: 'tool_choice forzato può non essere supportato: preferisci questa',
        }),
      ],
      frames: [
        frame(
          'Se chiedi dei dati in testo libero, il JSON può essere rotto, incompleto o con nomi sbagliati.',
          {
            hot: ['free'],
          },
        ),
        frame('Prima strada: uno strumento il cui schema descrive l’output, e si obbliga Claude a usarlo.', {
          hot: ['t1'],
        }),
        frame('Seconda: strict a true. I dati rispettano lo schema, senza eccezioni.', { hot: ['t2'] }),
        frame(
          'Terza: output_config.format con type json_schema. Risposta JSON diretta, senza passare da uno strumento.',
          {
            hot: ['t3'],
            set: { t3: { mark: 'ok' } },
          },
        ),
        frame(
          'Sui modelli di punta più recenti il tool_choice forzato può non funzionare: conviene la terza.',
          {
            hot: ['new'],
          },
        ),
      ],
    }),
    scene({
      id: 'schema-correttezza',
      label: 'Schema non vuol dire corretto',
      description: 'Una fattura con la forma giusta ma i numeri che non tornano.',
      takeaway:
        'Lo schema garantisce tipi e campi, non che i valori siano veri. I controlli di contenuto stanno nel codice; il dato assente è null, mai inventato.',
      actors: [
        code(
          'inv',
          'Risposta valida',
          '{ "vendor_name": "Acme",\n  "total_amount": 150.00,\n  "line_items": [100, 75] }',
          26,
          22,
          { w: 44 },
        ),
        box('schema', 'Controllo dello schema', 74, 22, {
          w: 32,
          from: 1,
          body: 'tipi ✓  campi ✓  enum ✓',
          mark: 'ok',
        }),
        code(
          'calc',
          'Controllo nel codice',
          '"stated_total": 150.00\n"calculated_total": 175.00\n"conflict_detected": true',
          26,
          66,
          { w: 44, from: 2 },
        ),
        box('null', 'Campo assente', 74, 62, {
          w: 32,
          from: 3,
          body: '"po_number": null\nnon un valore inventato',
        }),
        box('enum', 'Enum con uscite', 74, 86, { w: 32, from: 4, body: 'other · unclear' }),
      ],
      links: [['inv', 'schema']],
      frames: [
        frame('Una fattura estratta: tutto sembra a posto, i tipi sono giusti.', { hot: ['inv'] }),
        frame('Lo schema è soddisfatto: tipi corretti, campi obbligatori presenti.', {
          hot: ['schema'],
          flows: [['inv', 'schema']],
        }),
        frame(
          'Ma la somma delle voci è 175 e il totale dichiarato è 150: lo schema non se ne accorge. Serve un controllo nel codice.',
          {
            hot: ['calc'],
            set: { inv: { mark: 'no' } },
          },
        ),
        frame(
          'Se il numero d’ordine non c’è nel documento, lo schema deve ammettere null: altrimenti Claude è spinto a inventarlo.',
          {
            hot: ['null'],
          },
        ),
        frame(
          'Stesso principio per le categorie: other e unclear sono uscite oneste per i casi non previsti.',
          {
            hot: ['enum'],
          },
        ),
      ],
    }),
    scene({
      id: 'retry',
      label: 'Il ciclo di convalida',
      description:
        'Se i dati non passano i controlli, si rimanda a Claude con gli errori precisi, per poche volte.',
      takeaway:
        'Ritenta con gli errori specifici; inutile se il dato manca nel documento. Intervalli, date e regex non stanno dentro strict.',
      actors: [
        box('extract', 'Estrai', 14, 24, { w: 18, body: 'Claude + documento' }),
        box('check', 'Convalida', 40, 24, { w: 18, body: 'controlli nel codice' }),
        box('ok', 'Dati accettati', 86, 24, { w: 24, from: 2, mark: 'ok' }),
        code('err', 'Errori specifici', '«il totale non torna con\nle voci: 150 contro 175»', 40, 58, {
          w: 38,
          from: 1,
        }),
        box('stop', 'Dopo 3 tentativi', 80, 58, { w: 28, from: 3, body: 'si ferma e segnala\nl’errore' }),
        note('missing', 'Se il dato manca nel documento', 30, 88, {
          w: 50,
          from: 4,
          body: 'ritentare non serve: nessuna correzione lo farà comparire',
        }),
        note('out', 'Fuori da strict', 80, 88, { w: 34, from: 5, body: 'minimum, maxLength, pattern' }),
      ],
      links: [
        ['extract', 'check'],
        ['check', 'err'],
        ['err', 'extract'],
        ['check', 'ok'],
      ],
      frames: [
        frame('Claude estrae i dati e il codice li controlla.', {
          hot: ['extract', 'check'],
          flows: [['extract', 'check', 'dati']],
        }),
        frame('Un controllo fallisce: si rimanda a Claude l’errore preciso, non un generico «riprova».', {
          hot: ['err'],
          flows: [['check', 'err']],
        }),
        frame('Al tentativo successivo i dati passano e vengono accettati.', {
          hot: ['ok'],
          flows: [['check', 'ok']],
        }),
        frame('Il ciclo ha un limite, di solito tre tentativi, poi si segnala l’errore.', { hot: ['stop'] }),
        frame('Se il dato non esiste nel documento, ritentare è inutile.', { hot: ['missing'] }),
        frame(
          'Alcuni vincoli (minimi, lunghezze, pattern) strict non li supporta: si controllano fuori dallo schema.',
          {
            hot: ['out'],
          },
        ),
      ],
    }),
  ],
};
