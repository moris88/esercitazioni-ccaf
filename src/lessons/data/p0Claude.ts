import { box, code, frame, note, scene } from '../helpers';
import type { Lesson } from '../types';

export const p0Claude: Lesson = {
  id: 'p0-claude',
  group: 'pre',
  code: 'P·0',
  title: 'Che cos’è Claude',
  lesson: 'Pre-corso · Introduzione a Claude',
  goal: 'Sapere che cos’è Claude, dove si usa e come si parla con Claude Code dal terminale.',
  exam: 'Un solo modello, più strumenti: chat, app desktop, Claude Code (terminale e VS Code), API e Agent SDK.',
  scenes: [
    scene({
      id: 'strumenti',
      label: 'Un modello, tanti strumenti',
      description:
        'Al centro c’è Claude, il modello. Intorno compaiono i modi per usarlo: in alto quelli per tutti, in basso quelli per chi sviluppa.',
      takeaway:
        'Il modello è sempre Claude: cambia solo lo strumento con cui lo usi, dalla chat al terminale fino ai programmi.',
      actors: [
        box('model', 'Claude', 50, 50, { w: 26, body: 'il modello di Anthropic\nOpus · Sonnet · Haiku' }),
        box('chat', 'Chat (claude.ai)', 16, 14, { w: 28, from: 1, body: 'browser e app\ndel telefono' }),
        box('desktop', 'App desktop', 50, 14, {
          w: 28,
          from: 2,
          body: 'Windows e Mac,\ncon file e connettori',
        }),
        box('code', 'Claude Code', 16, 86, {
          w: 28,
          from: 3,
          body: 'nel terminale: legge,\nscrive, esegue comandi',
        }),
        box('vscode', 'Dentro VS Code', 84, 14, { w: 28, from: 4, body: 'Claude Code accanto\nal codice' }),
        box('api', 'API', 50, 86, { w: 28, from: 5, body: 'un programma chiede,\nClaude risponde' }),
        box('sdk', 'Agent SDK', 84, 86, { w: 28, from: 6, body: 'per costruire agenti\ncome Claude Code' }),
      ],
      links: [
        ['model', 'chat'],
        ['model', 'desktop'],
        ['model', 'vscode'],
        ['model', 'code'],
        ['model', 'api'],
        ['model', 'sdk'],
      ],
      frames: [
        frame(
          'Claude è un’intelligenza artificiale creata da Anthropic: legge testi, documenti e immagini e risponde. Esiste in più versioni: Opus, Sonnet e Haiku.',
          { hot: ['model'] },
        ),
        frame(
          'Il modo più semplice per usarlo è la chat su claude.ai, dal browser o dall’app del telefono.',
          {
            hot: ['chat'],
            flows: [['chat', 'model', 'domanda']],
          },
        ),
        frame(
          'L’app desktop è la stessa chat installata sul computer: può lavorare con i tuoi file e collegarsi ad altri servizi.',
          { hot: ['desktop'], flows: [['desktop', 'model']] },
        ),
        frame(
          'Claude Code lavora nel terminale: legge e modifica i file di una cartella ed esegue comandi, chiedendo il permesso.',
          { hot: ['code'], flows: [['code', 'model']] },
        ),
        frame(
          'Lo stesso Claude Code si può usare dentro VS Code, l’editor dei programmatori, accanto ai file aperti.',
          { hot: ['vscode'], flows: [['vscode', 'model']] },
        ),
        frame(
          'Con l’API non c’è una finestra: un programma manda la domanda e riceve la risposta, per esempio per leggere mille fatture.',
          { hot: ['api'], flows: [['api', 'model', 'richiesta']] },
        ),
        frame(
          'L’Agent SDK è il “motore” di Claude Code messo a disposizione di chi sviluppa, per costruire i propri agenti.',
          { hot: ['sdk'], flows: [['sdk', 'model']] },
        ),
        frame('Strumenti diversi, stesso modello: scegli quello adatto a chi lo usa e a cosa deve fare.', {
          hot: ['model', 'chat', 'desktop', 'vscode', 'code', 'api', 'sdk'],
        }),
      ],
    }),
    scene({
      id: 'terminale',
      label: 'Claude Code dal terminale',
      description:
        'I comandi principali per avviare Claude Code, fargli una domanda veloce, riprendere una conversazione e muoversi dentro la sessione.',
      takeaway:
        'claude apre la sessione, claude -p risponde e chiude, i comandi con / governano la sessione. Nel dubbio: /help.',
      actors: [
        code('start', 'Avviare', 'cd cartella-prova\nclaude', 26, 16, { w: 44 }),
        code('once', 'Una domanda e via', 'claude -p "riassumi README.md"', 74, 16, { w: 44, from: 1 }),
        code('resume', 'Riprendere', 'claude -c   ultima conversazione\nclaude -r   scegli quale', 26, 50, {
          w: 44,
          from: 2,
        }),
        code('slash', 'Comandi con /', '/help   /init    /model\n/clear  /compact /exit', 74, 50, {
          w: 44,
          from: 3,
        }),
        code(
          'keys',
          'Scorciatoie',
          '@file      allega un file\n!ls        esegue un comando\nEsc ferma · Shift+Tab permessi',
          26,
          84,
          {
            w: 44,
            from: 4,
          },
        ),
        note('help', 'Chiedere aiuto', 74, 84, {
          w: 44,
          from: 5,
          body: 'claude --help dal terminale\n/help dentro la sessione',
        }),
      ],
      frames: [
        frame(
          'Ci si sposta nella cartella su cui lavorare e si scrive claude: si apre una conversazione dentro il terminale.',
          { hot: ['start'] },
        ),
        frame(
          'Con il flag -p si fa una sola domanda: Claude risponde, stampa il risultato e torna al terminale.',
          { hot: ['once'] },
        ),
        frame('-c riprende l’ultima conversazione, -r fa scegliere quale riprendere da un elenco.', {
          hot: ['resume'],
        }),
        frame(
          'Dentro la sessione, i comandi che iniziano con / gestiscono Claude: /init crea CLAUDE.md, /model cambia modello, /clear ricomincia, /exit esce.',
          { hot: ['slash'] },
        ),
        frame(
          'Con @ si indica un file, con ! si esegue un comando del terminale. Esc interrompe, Shift+Tab cambia la modalità dei permessi.',
          { hot: ['keys'] },
        ),
        frame('Non serve ricordare tutto: --help e /help mostrano l’elenco completo.', { hot: ['help'] }),
      ],
    }),
  ],
};
