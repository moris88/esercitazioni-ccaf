import { box, code, frame, note, scene } from '../helpers';
import type { Lesson } from '../types';

export const p4Shell: Lesson = {
  id: 'p4-shell',
  group: 'pre',
  code: 'P·4',
  title: 'Riga di comando',
  lesson: 'Pre-corso · Riga di comando',
  goal: 'Capire i meccanismi del terminale su cui si basano hook, pipeline e server MCP.',
  exam: 'Hook = JSON su stdin ed exit code; segreti con ${VARIABILE}; privilegio minimo.',
  scenes: [
    scene({
      id: 'stdin',
      label: 'Flag, stdin ed exit code',
      description:
        'Un comando riceve opzioni, legge dati in ingresso e risponde con un numero che dice com’è andata.',
      takeaway: 'Un hook riceve un JSON su stdin e risponde con il codice di uscita: 0 consente, 2 blocca.',
      actors: [
        code('cmd', 'Comando', 'claude -p "riassumi" --max-turns 5', 28, 14, { w: 46 }),
        box('flag', 'Flag', 82, 14, { w: 24, from: 1, body: 'opzioni che cambiano\nil comportamento' }),
        code('in', 'stdin', '{ "tool": "process_refund",\n  "amount": 500 }', 20, 52, { w: 34, from: 2 }),
        box('hook', 'Script dell’hook', 56, 52, { w: 22, from: 2, body: 'legge e decide' }),
        box('e0', 'exit 0', 86, 40, { w: 16, from: 3, body: 'consenti', mark: 'ok' }),
        box('e2', 'exit 2', 86, 72, { w: 16, from: 4, body: 'blocca', mark: 'no' }),
      ],
      links: [
        ['in', 'hook'],
        ['hook', 'e0'],
        ['hook', 'e2'],
      ],
      frames: [
        frame('Un comando è fatto da un programma e dalle sue opzioni.', { hot: ['cmd'] }),
        frame('I flag (-p, --max-turns) cambiano il comportamento del programma.', { hot: ['flag'] }),
        frame(
          'Un programma può ricevere dati su stdin, l’ingresso standard. Un hook riceve così la richiesta di Claude.',
          {
            hot: ['in', 'hook'],
            flows: [['in', 'hook', 'JSON']],
          },
        ),
        frame(
          'Quando finisce, il programma restituisce un exit code: 0 vuol dire tutto bene, lo strumento può partire.',
          {
            hot: ['e0'],
            flows: [['hook', 'e0']],
          },
        ),
        frame('2 è la convenzione degli hook per bloccare: lo strumento non parte.', {
          hot: ['e2'],
          flows: [['hook', 'e2']],
        }),
      ],
    }),
    scene({
      id: 'segreti',
      label: 'Segreti e permessi',
      description: 'Dove non scrivere una password e quanti permessi dare a un agente.',
      takeaway:
        'Un segreto non si scrive nel file: si usa ${VARIABILE}. All’agente si danno solo i permessi che servono (privilegio minimo).',
      actors: [
        code('bad', '.mcp.json (da evitare)', '"Authorization": "Bearer sk-abc123…"', 26, 20, {
          w: 46,
          mark: 'no',
        }),
        code('good', '.mcp.json (corretto)', '"Authorization": "Bearer ${API_TOKEN}"', 26, 52, {
          w: 46,
          from: 1,
          mark: 'ok',
        }),
        box('env', 'Variabile d’ambiente', 80, 52, {
          w: 28,
          from: 2,
          body: 'API_TOKEN\nvive sul tuo computer',
        }),
        box('min', 'Privilegio minimo', 26, 86, {
          w: 36,
          from: 3,
          body: 'solo Read e Grep,\nnon Write o Bash',
        }),
        box('all', 'Tutti i permessi', 76, 86, { w: 36, from: 4, body: 'un errore costa molto', mark: 'no' }),
      ],
      links: [['env', 'good']],
      frames: [
        frame('Una password scritta dentro un file di configurazione finisce in Git e in mano a tutti.', {
          hot: ['bad'],
        }),
        frame('Si scrive solo il nome di una variabile.', { hot: ['good'] }),
        frame('Il valore vero sta nell’ambiente del tuo computer, fuori dal file condiviso.', {
          hot: ['env', 'good'],
          flows: [['env', 'good', 'valore']],
        }),
        frame('Stesso principio per i permessi: all’agente si dà solo ciò che serve davvero.', {
          hot: ['min'],
        }),
        frame('Dare tutti i permessi per comodità aumenta i danni possibili quando qualcosa va storto.', {
          hot: ['all'],
        }),
      ],
    }),
    scene({
      id: 'glob',
      label: 'Glob',
      description: 'Un glob è un modo di indicare molti file con un solo schema.',
      takeaway:
        '* sta per «qualsiasi cosa»; ** attraversa le sottocartelle. Servono per dire a Claude e agli hook su quali file agire.',
      actors: [
        code('p1', '*.md', 'tutti i file .md\nnella cartella corrente', 24, 22, { w: 36 }),
        code('p2', '**/*.test.ts', 'tutti i file di test\nin ogni sottocartella', 72, 22, { w: 40, from: 1 }),
        code('p3', 'src/**/config.*', 'config.json, config.yaml…\ndentro src', 24, 62, { w: 36, from: 2 }),
        note('use', 'A cosa serve', 72, 62, {
          w: 40,
          from: 3,
          body: 'matcher degli hook, regole per percorso, Glob di Claude Code',
        }),
      ],
      frames: [
        frame('Un asterisco vuol dire «qualsiasi cosa»: *.md trova tutti i file Markdown.', { hot: ['p1'] }),
        frame('Due asterischi attraversano le sottocartelle: **/*.test.ts trova tutti i test.', {
          hot: ['p2'],
        }),
        frame('Si possono combinare per cercare per cartella e nome.', { hot: ['p3'] }),
        frame(
          'Lo stesso schema compare nei matcher degli hook, nelle regole per percorso e nello strumento Glob.',
          {
            hot: ['use'],
          },
        ),
      ],
    }),
  ],
};
