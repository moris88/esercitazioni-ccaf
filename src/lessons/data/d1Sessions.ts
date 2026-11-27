import { box, code, frame, note, scene } from '../helpers';
import type { Lesson } from '../types';

export const d1Sessions: Lesson = {
  id: 'd1-sessioni',
  group: 'd1',
  code: 'D1·4',
  title: 'Scomposizione e sessioni',
  lesson: 'Dominio 1 · Parte 4 · Scomposizione e sessioni',
  goal: 'Scegliere tra sequenza fissa e scomposizione adattiva, rivedere una modifica grande in due passaggi e gestire sessioni riprese o ramificate.',
  exam: 'Passaggi noti: concatenazione; scoperte: adattiva. PR grande: per file, poi integrazione. Risultati validi: resume; altrimenti nuova sessione con riepilogo.',
  scenes: [
    scene({
      id: 'sequenza',
      label: 'Fissa o adattiva?',
      description:
        'Due modi di scomporre un lavoro: passi noti in anticipo oppure passi che nascono dalle scoperte.',
      takeaway:
        'Se i passaggi sono noti: concatenazione di prompt. Se dipendono da ciò che si scopre: scomposizione adattiva.',
      actors: [
        box('f1', '1 · Analizza ogni file', 17, 14, { w: 26 }),
        box('f2', '2 · Verifica integrazione', 50, 14, { w: 26, from: 1 }),
        box('f3', '3 · Rapporto finale', 83, 14, { w: 26, from: 2 }),
        box('q', '«Perché l’app è lenta?»', 17, 56, { w: 26, from: 3 }),
        box('d1', 'Uso della CPU', 50, 56, { w: 24, from: 4, body: 'scoperta: il database' }),
        box('d2', 'Schemi delle query', 83, 56, { w: 26, from: 5, body: 'scoperta: query N+1' }),
        box('d3', 'Correggi le query', 83, 86, { w: 26, from: 6 }),
      ],
      links: [
        ['f1', 'f2'],
        ['f2', 'f3'],
        ['q', 'd1'],
        ['d1', 'd2'],
        ['d2', 'd3'],
      ],
      frames: [
        frame('Prima famiglia: la sequenza fissa. Qui i passaggi si conoscono in anticipo.', { hot: ['f1'] }),
        frame('L’uscita di un passo alimenta il successivo.', { hot: ['f2'], flows: [['f1', 'f2']] }),
        frame('Si arriva al risultato senza sorprese. È la concatenazione di prompt.', {
          hot: ['f3'],
          flows: [['f2', 'f3']],
        }),
        frame('Seconda famiglia: un’indagine aperta. Non sai in anticipo quali passi serviranno.', {
          hot: ['q'],
        }),
        frame('Il primo passo rivela un collo di bottiglia nel database: da qui nasce il passo seguente.', {
          hot: ['d1'],
          flows: [['q', 'd1']],
        }),
        frame('Esaminando le query emerge un problema N+1: un’altra scoperta che decide il passo dopo.', {
          hot: ['d2'],
          flows: [['d1', 'd2']],
        }),
        frame(
          'Solo a questo punto si sa che cosa correggere. I passi sono emersi lungo la strada: è scomposizione adattiva.',
          { hot: ['d3'], flows: [['d2', 'd3']] },
        ),
      ],
    }),
    scene({
      id: 'pr',
      label: 'Revisione di una PR grande',
      description: 'Una modifica con molti file viene rivista in due passaggi distinti.',
      takeaway:
        'Prima ogni file da solo con lo stesso criterio, poi un passaggio separato sull’integrazione: un unico passaggio disperde l’attenzione.',
      actors: [
        box('pr', 'PR con 14 file', 12, 50, { w: 18 }),
        box('p1', 'Passaggio 1 · file per file', 44, 24, {
          w: 30,
          from: 1,
          body: 'stesso approfondimento:\nbug, stile, tipi',
        }),
        box('p2', 'Passaggio 2 · integrazione', 44, 76, {
          w: 30,
          from: 3,
          body: 'flusso dei dati,\ninterfacce, incoerenze',
        }),
        box('one', 'Un solo passaggio', 84, 24, {
          w: 28,
          from: 5,
          body: 'attenzione dispersa\nrisultati contraddittori\nintegrazione non vista',
          mark: 'no',
        }),
        box('out', 'Revisione completa', 84, 76, {
          w: 28,
          from: 4,
          body: 'dettagli + problemi\nche toccano più file',
          mark: 'ok',
        }),
      ],
      links: [
        ['pr', 'p1'],
        ['p1', 'p2'],
        ['p2', 'out'],
      ],
      frames: [
        frame('Una pull request con molti file: se chiedi tutto in un colpo, la qualità cala.', {
          hot: ['pr'],
        }),
        frame(
          'Primo passaggio: ogni file viene esaminato da solo, con lo stesso criterio e la stessa cura.',
          {
            hot: ['p1'],
            flows: [['pr', 'p1']],
          },
        ),
        frame('Così i criteri sono coerenti e i file in fondo all’elenco non vengono trascurati.', {
          hot: ['p1'],
        }),
        frame(
          'Secondo passaggio, con un prompt distinto: come interagiscono i file tra loro. Riceve i risultati del primo.',
          { hot: ['p2'], flows: [['p1', 'p2', 'risultati']] },
        ),
        frame('Il risultato unisce i dettagli di ogni file e i problemi che coinvolgono più file.', {
          hot: ['out'],
          flows: [['p2', 'out']],
        }),
        frame(
          'Perché non un solo passaggio? Il modello si concentra sui primi file, applica criteri incoerenti e non vede i problemi tra file.',
          { hot: ['one'] },
        ),
      ],
    }),
    scene({
      id: 'resume',
      label: 'Riprendere o ramificare',
      description:
        'Che cosa fare quando si torna su un lavoro già avviato, e come si prova una seconda strada.',
      takeaway:
        'Risultati ancora validi: --resume. File cambiati: dillo esplicitamente o riparti con un riepilogo. Due strade dalla stessa base: --fork-session.',
      actors: [
        box('s', 'Sessione di ieri', 14, 22, { w: 22, body: 'ha letto auth.py' }),
        box('file', 'auth.py', 14, 62, { w: 18, body: 'cambiato nel frattempo', from: 1 }),
        box('res', '--resume', 48, 22, { w: 22, from: 2, body: 'riprende con tutto\nil contesto' }),
        note('stale', 'Non se ne accorge', 48, 62, {
          w: 26,
          from: 3,
          body: 'i risultati letti ieri\nsono vecchi',
        }),
        code(
          'say',
          'Dillo esplicitamente',
          '«Ho aggiornato auth.py per usare\nJWT. Analizza di nuovo il flusso.»',
          82,
          22,
          {
            w: 34,
            from: 4,
            until: 4,
          },
        ),
        box('fork', '--fork-session', 82, 22, { w: 26, from: 5, body: 'nuovo ID,\nl’originale resta' }),
        box('a', 'Ramo A', 70, 70, { w: 16, from: 5, body: 'classi' }),
        box('b', 'Ramo B', 92, 70, { w: 14, from: 5, body: 'funzioni' }),
      ],
      links: [
        ['s', 'res'],
        ['res', 'say'],
        ['fork', 'a'],
        ['fork', 'b'],
      ],
      frames: [
        frame('Una sessione di ieri ha analizzato il file auth.py. Oggi si vuole continuare.', {
          hot: ['s'],
        }),
        frame('Nel frattempo il file è stato modificato.', { hot: ['file'], set: { file: { mark: 'no' } } }),
        frame(
          '--resume riprende la conversazione con tutto il contesto. Va bene se i risultati degli strumenti sono ancora validi.',
          { hot: ['res'], flows: [['s', 'res']] },
        ),
        frame(
          'Ma la sessione ripresa non si accorge da sola che i file sono cambiati: i vecchi risultati possono essere superati.',
          { hot: ['stale'], set: { stale: { mark: 'no' } } },
        ),
        frame(
          'La soluzione è dirlo: cosa è cambiato e che cosa rianalizzare. Se è cambiato molto, meglio una nuova sessione con un riepilogo.',
          { hot: ['say'], flows: [['res', 'say']] },
        ),
        frame(
          'Per provare due approcci dalla stessa base si ramifica: --fork-session crea una copia con un nuovo ID.',
          { hot: ['fork'] },
        ),
        frame('Un ramo prova le classi, l’altro le funzioni; la sessione di partenza resta intatta.', {
          hot: ['a', 'b'],
          flows: [
            ['fork', 'a'],
            ['fork', 'b'],
          ],
        }),
      ],
    }),
  ],
};
