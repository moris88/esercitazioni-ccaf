import { box, code, frame, meter, note, scene } from '../helpers';
import type { Lesson } from '../types';

export const d5Review: Lesson = {
  id: 'd5-revisione',
  group: 'd5',
  code: 'D5·3',
  title: 'Revisione umana e provenienza',
  lesson: 'Dominio 5 · Parte 3 · Revisione umana e provenienza',
  goal: 'Decidere dove far guardare una persona, perché una media può ingannare e come tenere traccia di fonti, conflitti e date.',
  exam: 'Revisione per rischio (20%, 10%, 5%); confidenza per campo e calibrata; mai fidarsi di una media; fonti in disaccordo: annota; tre date.',
  scenes: [
    scene({
      id: 'campionamento',
      label: 'Dove guardare',
      description:
        'Una persona non può controllare tutto: la revisione si concentra dove l’errore è più probabile.',
      takeaway:
        'Campionamento stratificato: più controlli sul rischio alto. Confidenza per campo, non solo complessiva, e calibrata su dati etichettati.',
      actors: [
        meter('hi', 'Rischio alto', 20, 22, 14, { w: 30, body: '20% controllato' }),
        meter('mid', 'Rischio medio', 10, 22, 40, { w: 30, from: 1, body: '10% controllato' }),
        meter('lo', 'Rischio basso', 5, 22, 66, { w: 30, from: 1, body: '5% controllato' }),
        code(
          'conf',
          'Confidenza per campo',
          'vendor_name   0.99\ntotal_amount  0.95\npurchase_order 0.72\ntax_id        0.45  ← controlla',
          72,
          32,
          { w: 44, from: 2 },
        ),
        note('cal', 'Calibrata', 72, 76, {
          w: 44,
          from: 3,
          body: '0,9 = corretto circa 9 volte su 10, verificato su dati etichettati',
        }),
      ],
      frames: [
        frame(
          'Si divide il materiale per rischio e si controlla di più dove si sbaglia di più: 20% nel rischio alto.',
          {
            hot: ['hi'],
          },
        ),
        frame(
          'Meno nel rischio medio (10%) e ancora meno in quello basso (5%): la revisione va dove serve.',
          {
            hot: ['mid', 'lo'],
          },
        ),
        frame(
          'La confidenza si dà campo per campo: così si vede quali controllare, non solo se l’estrazione è affidabile in media.',
          {
            hot: ['conf'],
          },
        ),
        frame('E deve essere calibrata: 0,9 deve voler dire davvero «giusto nel 90% dei casi».', {
          hot: ['cal'],
        }),
      ],
    }),
    scene({
      id: 'media',
      label: 'La media che nasconde',
      description:
        'Un’accuratezza complessiva alta può coprire fallimenti gravi su un tipo di documento o su un campo.',
      takeaway:
        'Riporta sempre l’accuratezza per tipo di documento e per campo: una media del 97% può nascondere un campo critico al 42%.',
      actors: [
        meter('all', 'Complessiva', 97, 50, 14, { w: 44, body: 'sembra ottima' }),
        meter('std', 'Fatture standard', 99, 20, 40, { w: 28, from: 1 }),
        meter('lang', 'Documenti in lingua straniera', 62, 50, 40, { w: 30, from: 1 }),
        meter('hand', 'Note a mano', 45, 80, 40, { w: 28, from: 1 }),
        meter('f1', 'vendor_name', 85, 20, 74, { w: 26, from: 2 }),
        meter('f2', 'total_amount', 42, 50, 74, { w: 26, from: 2, mark: 'no' }),
        meter('f3', 'line_items', 38, 80, 74, { w: 26, from: 2, mark: 'no' }),
      ],
      frames: [
        frame('Accuratezza complessiva: 97%. Sembra un risultato eccellente.', { hot: ['all'] }),
        frame(
          'Divisa per tipo di documento: le fatture standard vanno benissimo, ma i documenti in lingua straniera e le note a mano molto meno.',
          {
            hot: ['lang', 'hand'],
          },
        ),
        frame(
          'Per campo, sulle note a mano: totale e righe sono al 42% e 38%: un fallimento su ciò che conta di più.',
          {
            hot: ['f2', 'f3'],
          },
        ),
        frame('La media nascondeva tutto: per questo si riportano sempre i numeri per tipo e per campo.', {
          hot: ['all', 'f2'],
        }),
      ],
    }),
    scene({
      id: 'fonti',
      label: 'Fonti, conflitti e date',
      description: 'Due fonti riportano valori diversi: il conflitto si annota, non si risolve in silenzio.',
      takeaway:
        'Ogni affermazione porta la sua fonte. Se le fonti non concordano si annota il conflitto, e si tengono separate tre date: dato, pubblicazione, raccolta.',
      actors: [
        code('a', 'Comunicato stampa', 'Ricavi Q4: $2.3B\n(dati preliminari)', 22, 22, { w: 34 }),
        code('b', 'Deposito SEC', 'Ricavi Q4: $2.28B\n(dati sottoposti ad audit)', 22, 56, {
          w: 34,
          from: 1,
        }),
        code(
          'conf',
          'Conflitto annotato',
          '"field": "Ricavi Q4"\n"values": [2.3B, 2.28B]\n"resolution": "fa fede il deposito SEC"',
          72,
          38,
          { w: 44, from: 2 },
        ),
        box('d1', 'data_as_of', 18, 88, { w: 24, from: 3, body: 'a quando si riferisce il dato' }),
        box('d2', 'source_published', 50, 88, { w: 26, from: 3, body: 'quando è stata pubblicata' }),
        box('d3', 'retrieved_on', 82, 88, { w: 24, from: 3, body: 'quando l’hai raccolta' }),
      ],
      links: [
        ['a', 'conf'],
        ['b', 'conf'],
      ],
      frames: [
        frame('Una fonte dice 2,3 miliardi: sono dati preliminari.', { hot: ['a'] }),
        frame('Un’altra dice 2,28 miliardi: sono dati sottoposti ad audit.', { hot: ['b'] }),
        frame(
          'Non si sceglie in silenzio: si annota il conflitto, con le due fonti e quale ha la precedenza e perché.',
          {
            hot: ['conf'],
            flows: [
              ['a', 'conf'],
              ['b', 'conf'],
            ],
          },
        ),
        frame(
          'E le date sono tre cose diverse: a quando si riferisce il dato, quando è stato pubblicato, quando l’hai raccolto.',
          {
            hot: ['d1', 'd2', 'd3'],
          },
        ),
      ],
    }),
  ],
};
