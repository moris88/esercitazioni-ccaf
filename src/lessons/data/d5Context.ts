import { box, code, frame, meter, note, scene } from '../helpers';
import type { Lesson } from '../types';

export const d5Context: Lesson = {
  id: 'd5-contesto',
  group: 'd5',
  code: 'D5·1',
  title: 'Gestire il contesto',
  lesson: 'Dominio 5 · Parte 1 · Gestire il contesto',
  goal: 'Capire come si riempie la finestra di contesto, che cosa si perde nei riassunti e come lavorare in sessioni lunghe senza degrado.',
  exam: 'Una finestra grande non è gratuita; i fatti critici in un blocco persistente; il centro di un input lungo viene trascurato; scratchpad, Explore, /compact proattivo.',
  scenes: [
    scene({
      id: 'finestra',
      label: 'Finestra e riassunti',
      description: 'Il contesto si riempie a ogni turno, e un riassunto perde i numeri esatti.',
      takeaway:
        'Più contesto non vuol dire risposte migliori. I fatti critici stanno in un blocco persistente, non nel riassunto.',
      actors: [
        meter('ctx', 'Contesto', 10, 20, 16, { w: 30, body: 'ogni turno si pagano\ntutti i token' }),
        box('sum', 'Riassunto', 24, 60, {
          w: 26,
          from: 3,
          body: '«circa $150»\n«metà gennaio»\n«circa il 24%»',
          mark: 'no',
        }),
        code('real', 'Dati reali', '$149.99\n2024-01-15\n23.7%', 60, 60, { w: 22, from: 3 }),
        code(
          'facts',
          'FATTI DEL CASO (non riassumere)',
          'ID cliente: 12345\nOrdine: 67890\nData: 2024-01-15\nTotale: $149.99',
          78,
          22,
          { w: 40, from: 4 },
        ),
        note('why', 'Perché', 50, 90, {
          w: 76,
          from: 5,
          body: 'il blocco resta uguale a ogni turno: i numeri esatti non si deformano',
        }),
      ],
      frames: [
        frame('La finestra di contesto è grande, ma non è gratuita.', { hot: ['ctx'] }),
        frame('Più la conversazione cresce, più token si pagano a ogni turno, e la qualità può calare.', {
          hot: ['ctx'],
          set: { ctx: { value: 55 } },
        }),
        frame('Quando è piena, si riassume. Ma il riassunto è una stima.', {
          hot: ['ctx'],
          set: { ctx: { value: 88 } },
        }),
        frame(
          'Nel riassunto 149,99 diventa «circa 150», una data diventa «metà gennaio»: i numeri esatti si perdono.',
          {
            hot: ['sum', 'real'],
            set: { ctx: { value: 30 } },
          },
        ),
        frame('Soluzione: un blocco dei fatti del caso, che non si riassume mai.', { hot: ['facts'] }),
        frame('Resta identico in tutta la conversazione, così le cifre importanti arrivano intatte.', {
          hot: ['why', 'facts'],
        }),
      ],
    }),
    scene({
      id: 'mezzo',
      label: 'Il centro e gli strumenti verbosi',
      description:
        'Dove mettere le informazioni in un input lungo e come tenere leggero il risultato degli strumenti.',
      takeaway:
        'Inizio e fine di un input lungo si leggono meglio del centro. Filtra l’output degli strumenti: 5 campi, non 40.',
      actors: [
        box('top', 'Inizio', 50, 14, { w: 34, body: 'riepilogo con i risultati principali', mark: 'ok' }),
        box('mid', 'Centro', 50, 44, { w: 34, from: 1, body: 'qui si legge peggio', mark: 'no' }),
        box('end', 'Fine', 50, 74, { w: 34, from: 2, body: 'se serve, ripeti il punto chiave', mark: 'ok' }),
        code(
          'raw',
          'Strumento: 40 campi',
          '{ order_id, status, …\n  (altri 38 campi\n   mai usati) }',
          16,
          44,
          { w: 26, from: 3 },
        ),
        code(
          'lean',
          'Filtrato: 5 campi',
          '{ order_id: "67890",\n  status: "delivered",\n  delivery_date, total,\n  items }',
          84,
          44,
          { w: 28, from: 4 },
        ),
      ],
      links: [['raw', 'lean']],
      frames: [
        frame(
          'In un input lungo, ciò che sta all’inizio è letto bene: ci si mette il riepilogo e le intestazioni.',
          {
            hot: ['top'],
          },
        ),
        frame('Ciò che sta nel mezzo rischia di essere trascurato: mai lì le informazioni critiche.', {
          hot: ['mid'],
        }),
        frame('La fine è letta bene: se un punto è importante lo si può ripetere qui.', { hot: ['end'] }),
        frame(
          'Un secondo problema: uno strumento che restituisce quaranta campi, quasi tutti inutili, riempie il contesto.',
          {
            hot: ['raw'],
          },
        ),
        frame('Si filtra prima di restituire il risultato a Claude: bastano cinque campi.', {
          hot: ['lean'],
          flows: [['raw', 'lean', 'filtra']],
          set: { lean: { mark: 'ok' } },
        }),
      ],
    }),
    scene({
      id: 'sessioni-lunghe',
      label: '/compact e sessioni lunghe',
      description: 'Che cosa sopravvive alla compattazione e come evitare il degrado in un lavoro lungo.',
      takeaway:
        'Ciò che non deve andare perso va scritto in file o in un blocco persistente. Scratchpad, subagente Explore e /compact proattivo evitano il degrado.',
      actors: [
        box('keep', 'Sopravvive', 22, 20, {
          w: 34,
          body: 'CLAUDE.md (riletto)\nprompt di sistema\nmessaggi recenti\nMEMORY.md',
          mark: 'ok',
        }),
        box('lost', 'Può andare perso', 72, 20, {
          w: 34,
          from: 1,
          body: 'dettagli di conversazioni vecchie\nrisultati specifici\nnumeri e citazioni esatte',
          mark: 'no',
        }),
        note('sign', 'Segnali di degrado', 22, 60, {
          w: 34,
          from: 2,
          body: 'parla di «schemi tipici»\nrisposte incoerenti\ndimentica le scoperte',
        }),
        box('pad', 'Scratchpad', 66, 56, { w: 20, from: 3, body: 'file di appunti' }),
        box('exp', 'Explore', 88, 56, { w: 18, from: 3, body: 'solo riepilogo' }),
        box('comp', '/compact proattivo', 58, 86, { w: 28, from: 4, body: 'prima del degrado' }),
        box('man', 'Manifesto', 88, 86, { w: 20, from: 4, body: 'stato di ogni agente' }),
      ],
      frames: [
        frame(
          'Quando si compatta il contesto, certe cose restano: le istruzioni riletti da disco, il prompt di sistema, i messaggi recenti.',
          {
            hot: ['keep'],
          },
        ),
        frame(
          'Altre possono andare perse: dettagli, risultati di strumenti, numeri e citazioni dell’inizio.',
          {
            hot: ['lost'],
          },
        ),
        frame(
          'In una sessione molto lunga si riconosce il degrado: risposte generiche, incoerenze, scoperte dimenticate.',
          {
            hot: ['sign'],
          },
        ),
        frame('Rimedi: appunti in un file, un subagente Explore che restituisce solo un riepilogo.', {
          hot: ['pad', 'exp'],
        }),
        frame(
          'E /compact fatto per tempo, con un riepilogo strutturato, più un manifesto per riprendere dopo un arresto.',
          {
            hot: ['comp', 'man'],
          },
        ),
      ],
    }),
  ],
};
