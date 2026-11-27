import { box, code, frame, note, scene } from '../helpers';
import type { Lesson } from '../types';

export const d3Memory: Lesson = {
  id: 'd3-memoria',
  group: 'd3',
  code: 'D3·1',
  title: 'CLAUDE.md e regole',
  lesson: 'Dominio 3 · Parte 1 · CLAUDE.md e regole',
  goal: 'Capire dove Claude Code legge le istruzioni, in che ordine e come tenerle ordinate in un progetto con tante cartelle.',
  exam: 'Gerarchia policy → utente → progetto → locale → directory; @import fino a 5 livelli; regole con paths; CLAUDE.md è condiviso, la memoria automatica è personale.',
  scenes: [
    scene({
      id: 'gerarchia',
      label: 'La gerarchia',
      description: 'Cinque posti dove possono stare le istruzioni, dal più generale al più specifico.',
      takeaway:
        'Dal più generale al più specifico: il più specifico prevale. Le regole per tutto il team vanno nel CLAUDE.md di progetto, condiviso con Git.',
      actors: [
        box('l1', '1 · Policy gestita', 50, 10, {
          w: 56,
          body: 'decisa dall’IT, per tutta l’organizzazione',
        }),
        box('l2', '2 · Utente', 50, 30, { w: 56, from: 1, body: '~/.claude/CLAUDE.md — personale' }),
        box('l3', '3 · Progetto', 50, 50, { w: 56, from: 2, body: './CLAUDE.md — condiviso via Git' }),
        box('l4', '4 · Progetto locale', 50, 70, {
          w: 56,
          from: 3,
          body: 'CLAUDE.local.md — non condiviso (.gitignore)',
        }),
        box('l5', '5 · Directory', 50, 90, {
          w: 56,
          from: 4,
          body: 'src/api/CLAUDE.md — solo quando Claude legge file lì',
        }),
        note('arrow', 'Più specifico prevale', 88, 50, { w: 20, from: 5 }),
      ],
      links: [
        ['l1', 'l2'],
        ['l2', 'l3'],
        ['l3', 'l4'],
        ['l4', 'l5'],
      ],
      frames: [
        frame('In cima c’è la policy gestita: la decide l’IT e vale per tutta l’organizzazione.', {
          hot: ['l1'],
        }),
        frame('Poi il livello utente: le tue preferenze personali, per tutti i tuoi progetti.', {
          hot: ['l2'],
        }),
        frame('Il CLAUDE.md di progetto è quello del team: va in Git ed è sempre caricato.', { hot: ['l3'] }),
        frame('La versione locale è solo tua, in quel progetto, e resta fuori da Git.', { hot: ['l4'] }),
        frame(
          'I CLAUDE.md nelle cartelle si caricano su richiesta, quando Claude legge file di quella cartella.',
          {
            hot: ['l5'],
          },
        ),
        frame(
          'Si legge dall’alto verso il basso: se due istruzioni sono in conflitto, vince la più specifica.',
          {
            hot: ['arrow', 'l5'],
          },
        ),
      ],
    }),
    scene({
      id: 'import',
      label: '@import e AGENTS.md',
      description: 'Come si spezzano le istruzioni in più file e si riusa un AGENTS.md esistente.',
      takeaway:
        'Un CLAUDE.md può importare altri file (fino a 5 livelli). AGENTS.md si legge solo se manca CLAUDE.md: importalo per tenere una sola fonte.',
      actors: [
        code(
          'main',
          'CLAUDE.md',
          '# Configurazione\n@docs/coding-standards.md\n@docs/api-conventions.md\n@~/.claude/my-preferences.md',
          25,
          24,
          { w: 42 },
        ),
        box('d1', 'coding-standards.md', 78, 10, { w: 30, from: 1 }),
        box('d2', 'api-conventions.md', 78, 32, { w: 30, from: 1 }),
        note('deep', 'Profondità massima', 25, 66, {
          w: 36,
          from: 2,
          body: '5 passaggi: anche i file importati possono importare',
        }),
        code('agents', 'AGENTS.md', 'regole comuni a più strumenti', 78, 56, { w: 30, from: 3 }),
        code('claude2', 'CLAUDE.md', '@AGENTS.md\nUsa plan mode in src/billing/', 78, 82, { w: 30, from: 4 }),
      ],
      links: [
        ['main', 'd1'],
        ['main', 'd2'],
        ['claude2', 'agents'],
      ],
      frames: [
        frame('Un CLAUDE.md lungo diventa difficile da mantenere.', { hot: ['main'] }),
        frame(
          'Si possono importare altri file con @: i percorsi sono relativi al file che importa, e @~/ indica la tua cartella personale.',
          {
            hot: ['main', 'd1', 'd2'],
            flows: [['main', 'd1', '@import']],
          },
        ),
        frame('Anche i file importati possono importarne altri, fino a cinque passaggi.', { hot: ['deep'] }),
        frame(
          'Se il team usa già un AGENTS.md per altri strumenti, Claude lo legge solo se non esiste un CLAUDE.md.',
          {
            hot: ['agents'],
          },
        ),
        frame(
          'Soluzione: un CLAUDE.md che importa AGENTS.md e aggiunge solo ciò che serve a Claude. Una sola fonte, niente copie.',
          {
            hot: ['claude2', 'agents'],
            flows: [['claude2', 'agents', '@AGENTS.md']],
            set: { claude2: { mark: 'ok' } },
          },
        ),
      ],
    }),
    scene({
      id: 'regole',
      label: 'Regole per percorso e memoria',
      description: 'Una regola può valere solo per certi file; la memoria automatica è un’altra cosa.',
      takeaway:
        'Una regola per percorso al posto di tanti CLAUDE.md sparsi. CLAUDE.md si condivide con Git; la memoria automatica resta personale e locale.',
      actors: [
        box('many', 'Tanti CLAUDE.md', 20, 22, {
          w: 32,
          body: 'components/CLAUDE.md\napi/CLAUDE.md\nutils/CLAUDE.md\nstesse regole copiate',
          mark: 'no',
        }),
        code(
          'rule',
          '.claude/rules/testing.md',
          '---\npaths: ["**/*.test.*"]\n---\nConvenzioni per i test',
          74,
          22,
          { w: 40, from: 1 },
        ),
        box('always', 'Senza paths', 20, 62, { w: 26, from: 2, body: 'si carica sempre,\nall’avvio' }),
        box('only', 'Con paths', 50, 62, { w: 26, from: 2, body: 'solo sui file\nche corrispondono' }),
        box('mem', 'Memoria automatica', 80, 62, {
          w: 28,
          from: 3,
          body: 'MEMORY.md\npersonale, locale, non in Git',
        }),
        note('claude', 'CLAUDE.md', 50, 90, { w: 40, from: 4, body: 'condivisibile e versionato' }),
      ],
      frames: [
        frame('Le stesse convenzioni di test copiate in tante cartelle: facile dimenticarne una.', {
          hot: ['many'],
        }),
        frame(
          'Con una regola per percorso, un solo file vale ovunque ci siano file di test, anche nelle cartelle nuove.',
          {
            hot: ['rule'],
            set: { many: { mark: null } },
          },
        ),
        frame('Una regola senza paths si carica sempre; con paths solo quando Claude lavora su quei file.', {
          hot: ['always', 'only'],
        }),
        frame(
          'La memoria automatica è diversa: Claude annota schemi, decisioni e preferenze in un file personale.',
          {
            hot: ['mem'],
          },
        ),
        frame('CLAUDE.md invece si può condividere e versionare con tutto il team.', {
          hot: ['claude', 'mem'],
        }),
      ],
    }),
  ],
};
