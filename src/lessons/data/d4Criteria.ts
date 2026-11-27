import { box, code, frame, note, scene } from '../helpers';
import type { Lesson } from '../types';

export const d4Criteria: Lesson = {
  id: 'd4-criteri',
  group: 'd4',
  code: 'D4·1',
  title: 'Criteri espliciti e few-shot',
  lesson: 'Dominio 4 · Parte 1 · Criteri espliciti e few-shot',
  goal: 'Capire perché le istruzioni vaghe danno risultati incoerenti e come criteri precisi ed esempi mirati riducono i falsi positivi.',
  exam: 'Istruzioni vaghe = risultati incoerenti; criteri con cosa rientra, cosa è escluso, esempi; categoria rumorosa: disattiva, migliora, riattiva; few-shot: 2–4 esempi.',
  scenes: [
    scene({
      id: 'esplicito',
      label: 'Vago o esplicito?',
      description:
        'La stessa richiesta scritta in modo vago e in modo preciso, con i risultati che ne derivano.',
      takeaway:
        'Un criterio dice cosa rientra, cosa è escluso e mostra esempi di confine. Un’istruzione vaga viene interpretata in modo diverso ogni volta.',
      actors: [
        code('vago', 'Vago', '«Segnala i problemi\ncon prudenza»', 22, 18, { w: 34 }),
        box('r1', 'Lunedì', 14, 54, { w: 14, from: 1, body: '12 segnalazioni' }),
        box('r2', 'Martedì', 32, 54, { w: 14, from: 1, body: '3 segnalazioni' }),
        code(
          'chiaro',
          'Esplicito',
          'Segnala un commento SOLO quando\ncontraddice il comportamento reale.\nNON segnalare commenti incompleti\no troppo brevi.',
          72,
          24,
          { w: 50, from: 3 },
        ),
        box('in', 'Cosa rientra', 18, 84, { w: 24, from: 4, body: 'condizioni precise' }),
        box('out', 'Cosa è escluso', 46, 84, { w: 26, from: 4, body: 'casi limite' }),
        box('ex', 'Esempi', 76, 84, { w: 22, from: 4, body: 'il confine, con il perché' }),
      ],
      frames: [
        frame('«Segnala i problemi con prudenza»: ognuno intende una cosa diversa, anche il modello.', {
          hot: ['vago'],
          set: { vago: { mark: 'no' } },
        }),
        frame('Lunedì dodici segnalazioni, martedì tre, per lo stesso codice: risultati incoerenti.', {
          hot: ['r1', 'r2'],
        }),
        frame('Più avanti nessuno si fida più delle segnalazioni.', { hot: ['r1', 'r2'] }),
        frame(
          'Un criterio esplicito dice quando segnalare e quando no, con parole che non si prestano a dubbi.',
          {
            hot: ['chiaro'],
            set: { chiaro: { mark: 'ok' } },
          },
        ),
        frame('Un buon criterio ha tre parti: cosa rientra, cosa è escluso, esempi concreti.', {
          hot: ['in', 'out', 'ex'],
        }),
      ],
    }),
    scene({
      id: 'rumore',
      label: 'Falsi positivi',
      description:
        'Quando una categoria di segnalazioni produce troppo rumore, si lavora su di essa senza spegnere tutto.',
      takeaway:
        'Categoria rumorosa: disattivala, migliora i criteri, riattivala. Registra il pattern rilevato per capire dove perfezionare.',
      actors: [
        box('noisy', 'Categoria rumorosa', 16, 24, { w: 26, body: 'molti falsi allarmi' }),
        box('s1', '1 · Disattiva', 16, 62, { w: 22, from: 1, body: 'temporaneamente' }),
        box('s2', '2 · Migliora', 44, 62, { w: 22, from: 2, body: 'criteri più precisi' }),
        box('s3', '3 · Riattiva', 72, 62, { w: 22, from: 3, body: 'quando i falsi sono pochi' }),
        code(
          'pat',
          'Pattern tracciato',
          '"issue": "Possibile SQL injection"\n"detected_pattern": "stringhe\n  concatenate nella query"\n"file": "users.py", "line": 42',
          66,
          24,
          { w: 44, from: 4 },
        ),
        note('why', 'Perché serve', 50, 86, {
          w: 76,
          from: 5,
          body: 'se gli sviluppatori ignorano sempre lo stesso pattern, è lì che vanno perfezionati i criteri',
        }),
      ],
      links: [
        ['s1', 's2'],
        ['s2', 's3'],
      ],
      frames: [
        frame(
          'Una categoria produce troppi falsi allarmi e gli sviluppatori smettono di leggere tutte le segnalazioni.',
          {
            hot: ['noisy'],
            set: { noisy: { mark: 'no' } },
          },
        ),
        frame('Primo: la si spegne per un po’, così le altre categorie restano credibili.', { hot: ['s1'] }),
        frame('Secondo: si rendono più precisi i criteri di quella categoria.', {
          hot: ['s2'],
          flows: [['s1', 's2']],
        }),
        frame('Terzo: quando i falsi positivi sono sotto controllo, la si riattiva.', {
          hot: ['s3'],
          flows: [['s2', 's3']],
          set: { noisy: { mark: 'ok' } },
        }),
        frame('Ogni segnalazione porta con sé il pattern che l’ha fatta scattare.', { hot: ['pat'] }),
        frame('Se un pattern viene sempre ignorato, si sa dove migliorare.', { hot: ['why'] }),
      ],
    }),
    scene({
      id: 'few-shot',
      label: 'Gli esempi (few-shot)',
      description: 'Quando le parole non bastano, si mostrano pochi esempi ben scelti.',
      takeaway:
        'Da 2 a 4 esempi mirati; ognuno con input, output e ragionamento. Includono anche un caso da non segnalare.',
      actors: [
        box('when', 'Quando servono', 24, 16, {
          w: 40,
          body: 'casi ambigui · formato · meno allucinazioni · casi limite',
        }),
        code(
          'e1',
          'Esempio 1 · da segnalare',
          'Input: "// restituisce il nome completo"\nCodice: return user.firstName\nOutput: { issue: "…solo firstName" }\nPerché: contraddizione fattuale',
          26,
          56,
          { w: 46, from: 1 },
        ),
        code(
          'e2',
          'Esempio 2 · da NON segnalare',
          'Input: "// convalida l’input"\nCodice: input.length > 0 && < 100\nOutput: null\nPerché: vago ma non errato',
          74,
          56,
          { w: 46, from: 2 },
        ),
        box('few', 'Quanti?', 24, 88, { w: 34, from: 3, body: '2–4: pochi non coprono lo schema' }),
        box('many', 'Troppi', 72, 88, {
          w: 36,
          from: 4,
          body: 'sprecano contesto e vengono copiati',
          mark: 'no',
        }),
      ],
      frames: [
        frame('Gli esempi servono dove la prosa non basta: casi ambigui, formati precisi, casi limite.', {
          hot: ['when'],
        }),
        frame(
          'Un esempio mostra input, output e il ragionamento: qui una contraddizione vera da segnalare.',
          {
            hot: ['e1'],
          },
        ),
        frame('Serve anche un esempio che NON va segnalato: così Claude capisce dove sta il confine.', {
          hot: ['e2'],
        }),
        frame('Bastano da due a quattro esempi mirati.', { hot: ['few'] }),
        frame('Con troppi esempi si spreca contesto e il modello tende a copiarli.', { hot: ['many'] }),
      ],
    }),
  ],
};
