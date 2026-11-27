import { box, code, frame, note, scene } from '../helpers';
import type { Lesson } from '../types';

export const p2Formats: Lesson = {
  id: 'p2-formati',
  group: 'pre',
  code: 'P·2',
  title: 'YAML, Markdown, XML e CSV',
  lesson: 'Pre-corso · Formati dei dati',
  goal: 'Riconoscere i formati che compaiono negli scenari d’esame oltre al JSON e capire dove ciascuno può rompersi.',
  exam: 'Frontmatter nelle skill e nei subagenti; tag nei prompt; JSON con schema quando l’affidabilità conta.',
  scenes: [
    scene({
      id: 'quattro',
      label: 'I quattro formati',
      description:
        'Quattro formati con scopi diversi: configurazione, testo formattato, prompt organizzati e tabelle.',
      takeaway:
        'YAML per la configurazione (frontmatter), Markdown per il testo, tag XML per separare le parti di un prompt, CSV per le tabelle.',
      actors: [
        code('y', 'YAML', '---\nname: db-reader\ntools: Read, Grep\n---', 20, 24, { w: 32 }),
        code('m', 'Markdown', '# Titolo\n- punto uno\n- punto due', 64, 24, { w: 30, from: 1 }),
        code('x', 'Tag XML', '<documento>…</documento>\n<domanda>…</domanda>', 20, 72, { w: 32, from: 2 }),
        code('c', 'CSV', 'ordine,cliente,totale\n1001,Rossi,50\n1002,Bianchi,80', 64, 72, { w: 30, from: 3 }),
        note('ny', 'Dove lo trovi', 91, 24, { w: 16, from: 1, body: 'skill, subagenti' }),
        note('nc', 'Occhio', 91, 72, { w: 16, from: 4, body: 'virgole nei valori' }),
      ],
      frames: [
        frame(
          'YAML: configurazioni leggibili. Le skill e i subagenti iniziano con un frontmatter in YAML. Qui l’indentazione conta.',
          {
            hot: ['y'],
          },
        ),
        frame('Markdown: testo con titoli ed elenchi. È il formato di CLAUDE.md e dei file di istruzioni.', {
          hot: ['m', 'ny'],
        }),
        frame(
          'Tag XML: separano le parti di un prompt (documento, domanda, esempi) in modo che Claude non le confonda.',
          {
            hot: ['x'],
          },
        ),
        frame('CSV: una tabella in testo semplice, una riga per record.', { hot: ['c'] }),
        frame(
          'Ogni formato può rompersi: un rientro sbagliato in YAML, una virgola dentro un valore in CSV.',
          {
            hot: ['nc', 'c'],
            set: { c: { mark: 'no' } },
          },
        ),
      ],
    }),
    scene({
      id: 'scelta',
      label: 'Quale scegliere',
      description: 'Come scegliere il formato in base a chi deve leggere i dati: una persona o un programma.',
      takeaway:
        'Se a leggere è un programma e l’affidabilità conta: JSON con schema. Per le persone e per i prompt: Markdown e tag.',
      actors: [
        box('q1', 'Lo legge una persona?', 20, 20, { w: 30 }),
        box('a1', 'Markdown', 70, 14, { w: 22, from: 1, body: 'testo con titoli e elenchi' }),
        box('q2', 'Lo legge un programma?', 20, 56, { w: 30, from: 2 }),
        box('a2', 'JSON con schema', 70, 50, {
          w: 28,
          from: 3,
          body: 'affidabile e controllabile',
          mark: 'ok',
        }),
        box('q3', 'Parti del prompt da separare?', 20, 90, { w: 32, from: 4 }),
        box('a3', 'Tag XML', 70, 86, { w: 22, from: 5 }),
      ],
      links: [
        ['q1', 'a1'],
        ['q2', 'a2'],
        ['q3', 'a3'],
      ],
      frames: [
        frame('Prima domanda: chi leggerà questo testo?', { hot: ['q1'] }),
        frame('Una persona: Markdown, leggibile anche senza programmi.', {
          hot: ['a1'],
          flows: [['q1', 'a1']],
        }),
        frame('Un programma: serve un formato rigido.', { hot: ['q2'] }),
        frame('JSON con schema: si può controllare in modo automatico.', {
          hot: ['a2'],
          flows: [['q2', 'a2']],
        }),
        frame('Dentro un prompt con più parti (documento, istruzioni, esempi) servono delimitatori chiari.', {
          hot: ['q3'],
        }),
        frame('I tag XML dicono dove inizia e finisce ogni parte.', { hot: ['a3'], flows: [['q3', 'a3']] }),
      ],
    }),
  ],
};
