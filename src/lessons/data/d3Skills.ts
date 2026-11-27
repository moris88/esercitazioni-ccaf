import { box, code, frame, note, scene } from '../helpers';
import type { Lesson } from '../types';

export const d3Skills: Lesson = {
  id: 'd3-skill',
  group: 'd3',
  code: 'D3·2',
  title: 'Skill, plan mode e subagenti',
  lesson: 'Dominio 3 · Parte 2 · Skill, plan mode e subagenti',
  goal: 'Capire come è fatta una skill, quando serve il plan mode e come si usano i subagenti in Claude Code.',
  exam: 'description = invocazione automatica; disable-model-invocation = solo manuale; molti file o requisiti vaghi = plan mode; Explore legge tanto e restituisce poco.',
  scenes: [
    scene({
      id: 'skill',
      label: 'Com’è fatta una skill',
      description:
        'Una skill è una cartella con un file SKILL.md: i campi in testa dicono quando e come usarla.',
      takeaway:
        'description permette l’invocazione automatica; disable-model-invocation: true la rende solo manuale. Con context: fork gira in un subagente isolato.',
      actors: [
        code(
          'file',
          '.claude/skills/deploy/SKILL.md',
          '---\nname: deploy\ndescription: Distribuisci l’app\ncontext: fork\nagent: Explore\nallowed-tools: Bash(git *)\ndisable-model-invocation: true\n---\nDistribuisci in $ARGUMENTS',
          26,
          46,
          { w: 46 },
        ),
        box('desc', 'description', 76, 14, {
          w: 34,
          from: 1,
          body: 'Claude la usa per decidere\nse caricare la skill da solo',
        }),
        box('manual', 'disable-model-invocation', 76, 40, {
          w: 34,
          from: 2,
          body: 'true: solo a mano con /deploy',
        }),
        box('tools', 'allowed-tools', 76, 64, {
          w: 34,
          from: 3,
          body: 'strumenti preapprovati\nmentre la skill è attiva',
        }),
        box('fork', 'context: fork', 76, 88, {
          w: 34,
          from: 4,
          body: 'subagente isolato:\nha CLAUDE.md, non la cronologia',
        }),
      ],
      frames: [
        frame('Una skill è un file SKILL.md in una cartella. In testa ha dei campi, sotto le istruzioni.', {
          hot: ['file'],
        }),
        frame('description: è ciò che Claude legge per decidere da solo se caricare la skill.', {
          hot: ['desc'],
        }),
        frame(
          'disable-model-invocation a true: Claude non la avvia da solo, solo tu con il comando /deploy.',
          {
            hot: ['manual'],
          },
        ),
        frame('allowed-tools: gli strumenti che non chiedono permesso mentre la skill è attiva.', {
          hot: ['tools'],
        }),
        frame(
          'context: fork: la skill gira in un subagente isolato, che legge CLAUDE.md ma non la conversazione.',
          {
            hot: ['fork'],
          },
        ),
      ],
    }),
    scene({
      id: 'plan',
      label: 'Plan mode o esecuzione diretta?',
      description: 'Quando conviene prima pianificare e quando fare subito la modifica.',
      takeaway:
        'Molti file, scelte di architettura, più approcci o requisiti vaghi: plan mode. Una modifica piccola e chiara: esecuzione diretta.',
      actors: [
        box('plan', 'Plan mode', 24, 18, {
          w: 36,
          body: 'refactoring su 15 file\nREST o GraphQL?\n«rendi l’app più veloce»',
        }),
        box('direct', 'Esecuzione diretta', 76, 18, {
          w: 36,
          body: 'un controllo null\nun refuso, una costante\nistruzioni chiare',
        }),
        box('p1', '1 · Esplora', 12, 54, { w: 18, from: 3, body: 'Glob, Grep, Read' }),
        box('p2', '2 · Progetta', 34, 54, { w: 18, from: 3, body: 'un approccio' }),
        box('p3', '3 · Presenta', 56, 54, { w: 18, from: 3, body: 'il piano a te' }),
        box('p4', '4 · Implementa', 80, 54, { w: 22, from: 3, body: 'dopo l’approvazione' }),
        box('modes', 'Modalità di permesso', 50, 84, {
          w: 94,
          from: 4,
          body: 'default · acceptEdits · plan · auto · dontAsk · bypassPermissions (pericolosa: solo per attività brevi)',
        }),
      ],
      links: [
        ['p1', 'p2'],
        ['p2', 'p3'],
        ['p3', 'p4'],
      ],
      frames: [
        frame(
          'Il plan mode serve quando sbagliare strada costa: tante modifiche, scelte importanti, requisiti poco chiari.',
          {
            hot: ['plan'],
          },
        ),
        frame('Se la modifica è piccola e chiara, è inutile pianificare: si esegue.', { hot: ['direct'] }),
        frame('Il plan mode non modifica nulla finché non approvi: esplora in sola lettura.', {
          hot: ['plan'],
        }),
        frame('Quattro tappe: esplorare, progettare, presentare il piano, poi implementare.', {
          hot: ['p1', 'p2', 'p3', 'p4'],
          flows: [['p3', 'p4', 'approvato']],
        }),
        frame(
          'Le modalità di permesso si scelgono con --permission-mode o con Shift+Tab. bypassPermissions salta tutte le richieste: va usata con cautela.',
          {
            hot: ['modes'],
          },
        ),
      ],
    }),
    scene({
      id: 'subagenti',
      label: 'Subagenti integrati e propri',
      description: 'Claude Code ha subagenti già pronti e ne puoi definire di tuoi con un file.',
      takeaway:
        'Explore legge molto e restituisce un riepilogo, così il contesto principale resta pulito. Un subagente proprio si definisce con un file .md.',
      actors: [
        box('main', 'Conversazione principale', 22, 20, { w: 34, body: 'resta pulita' }),
        box('explore', 'Explore', 76, 20, { w: 26, from: 1, body: 'legge 50 file,\nsola lettura' }),
        code(
          'def',
          '.claude/agents/db-reader.md',
          '---\nname: db-reader\ndescription: Query di sola lettura\ntools: Read, Grep, Bash\ndisallowedTools: Write, Edit\nmodel: sonnet\nmaxTurns: 10\n---\nEsegui solo query SELECT.',
          28,
          70,
          { w: 48, from: 3 },
        ),
        note('built', 'Integrati', 76, 62, { w: 30, from: 2, body: 'Explore · Plan\ngeneral-purpose' }),
        note('prop', 'Permessi', 76, 88, { w: 36, from: 4, body: 'le modalità si propagano ai subagenti' }),
      ],
      links: [
        ['main', 'explore'],
        ['explore', 'main'],
      ],
      frames: [
        frame('La conversazione principale ha un contesto prezioso: meglio non riempirlo di file letti.', {
          hot: ['main'],
        }),
        frame('Explore legge tanti file in un contesto separato e restituisce solo un riepilogo.', {
          hot: ['explore'],
          flows: [['main', 'explore', 'cerca']],
        }),
        frame(
          'Il riepilogo torna e il contesto principale resta leggero. Esistono anche Plan e general-purpose.',
          {
            hot: ['main', 'built'],
            flows: [['explore', 'main', 'riepilogo']],
          },
        ),
        frame(
          'Un subagente proprio è un file .md: nome, descrizione, strumenti permessi, modello e limite di turni.',
          {
            hot: ['def'],
          },
        ),
        frame('Attenzione: le modalità di permesso si propagano ai subagenti, anche quelle poco prudenti.', {
          hot: ['prop'],
        }),
      ],
    }),
  ],
};
