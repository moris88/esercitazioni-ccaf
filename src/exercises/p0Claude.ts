import type { Exercise } from '../types';

export const p0Claude: Exercise = {
  id: 'p-0',
  code: 'P·0',
  lesson: 'Pre-corso · Introduzione a Claude',
  title: 'Che cos’è Claude e come si usa dal terminale',
  place: 'Claude (app o claude.ai) e Claude Code',
  minutes: 8,
  goal: 'Conoscere gli strumenti di Claude e fare i primi passi con Claude Code nel terminale.',
  observe: [
    'Lo stesso modello si usa da chat, app desktop, Claude Code (terminale e VS Code), API e Agent SDK.',
    'claude -p risponde a una sola domanda e torna subito al terminale.',
    'Dentro la sessione i comandi con / gestiscono Claude; il resto è una richiesta normale.',
    'Prima di modificare un file o eseguire un comando, Claude Code chiede il permesso.',
    'claude -c riprende l’ultima conversazione invece di ricominciare da zero.',
  ],
  exam: 'Un modello, più strumenti; claude = sessione, claude -p = domanda singola, / = comandi della sessione.',
  scenes: [
    {
      id: 'chat',
      label: '1. Gli strumenti di Claude',
      description:
        'Nella chat si chiede a Claude di presentare sé stesso e gli strumenti con cui si può usare.',
      simulator: 'chat',
      source: 'esempio',
      title: 'Nuova chat',
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: 'Che cos’è Claude e in quali modi posso usarlo? Rispondi con una tabella breve.',
        },
        {
          kind: 'message',
          role: 'assistant',
          text: 'Sono Claude, un modello di intelligenza artificiale creato da Anthropic. Puoi usarmi in diversi modi:',
        },
        {
          kind: 'table',
          columns: ['Strumento', 'Per chi', 'A cosa serve'],
          rows: [
            ['Chat (claude.ai)', 'tutti', 'domande, testi, documenti, dal browser o dal telefono'],
            ['App desktop', 'tutti', 'la chat sul computer, con file e connettori'],
            [
              'Claude Code',
              'chi lavora con file e progetti',
              'nel terminale: legge, modifica, esegue comandi',
            ],
            ['Claude Code in VS Code', 'chi usa l’editor', 'le stesse funzioni accanto al codice'],
            ['API', 'sviluppatori', 'un programma manda richieste e riceve risposte'],
            ['Agent SDK', 'sviluppatori', 'costruire agenti propri con il motore di Claude Code'],
          ],
          observe: [0],
          note: 'Il modello dietro è lo stesso: cambia lo strumento, non l’intelligenza.',
        },
      ],
    },
    {
      id: 'avvio',
      label: '2. Primi comandi nel terminale',
      description:
        'Nel terminale si controlla che Claude Code sia installato e gli si fa una domanda singola con il flag -p.',
      simulator: 'terminal',
      source: 'esempio',
      title: 'bash · cartella-prova',
      steps: [
        { kind: 'command', text: 'claude --help', note: '--help mostra comandi e flag disponibili.' },
        {
          kind: 'output',
          text: 'Usage: claude [options] [command] [prompt]\n  -p, --print       risponde e termina\n  -c, --continue    riprende l’ultima conversazione\n  -r, --resume      sceglie una conversazione da riprendere\n  …',
          tone: 'muted',
        },
        { kind: 'command', text: 'claude -p "Quali file ci sono in questa cartella?"' },
        {
          kind: 'output',
          text: 'Ci sono sei cartelle (bozze, ordini, procedure, riservato, risposte, spedizioni) e un file LEGGIMI.md.',
          tone: 'info',
          observe: [1],
          note: 'Dopo la risposta torna il prompt del terminale: nessuna sessione aperta.',
        },
      ],
    },
    {
      id: 'sessione',
      label: '3. Una sessione con Claude Code',
      description:
        'Si avvia claude, si guarda l’aiuto, si chiede una piccola modifica e si vede la richiesta di permesso.',
      simulator: 'code',
      source: 'esempio',
      title: 'cartella-prova',
      steps: [
        { kind: 'command', text: '/help' },
        {
          kind: 'output',
          text: '/init     crea CLAUDE.md\n/model    cambia modello\n/clear    ricomincia la conversazione\n/compact  riassume per liberare spazio\n/exit     esce',
          tone: 'muted',
          observe: [2],
          note: 'Le righe che iniziano con / sono comandi per Claude Code, non domande.',
        },
        {
          kind: 'message',
          role: 'user',
          text: 'Leggi @LEGGIMI.md e aggiungi in fondo una riga con la data di oggi.',
        },
        { kind: 'tool', name: 'Read', input: 'LEGGIMI.md', result: '6 righe', status: 'ok' },
        {
          kind: 'permission',
          question: 'Edit(LEGGIMI.md) — Vuoi applicare la modifica?',
          options: ['Sì', 'Sì, e non chiedere più per questa sessione', 'No'],
          choice: 0,
          observe: [3],
          note: 'Leggere è libero; scrivere o eseguire comandi richiede il vostro consenso.',
        },
        { kind: 'tool', name: 'Edit', input: 'LEGGIMI.md', result: 'aggiunta 1 riga', status: 'ok' },
        { kind: 'command', text: '/exit' },
      ],
    },
    {
      id: 'riprendere',
      label: '4. Riprendere il lavoro',
      description: 'Il giorno dopo si riapre il terminale e si riprende la conversazione di ieri con -c.',
      simulator: 'terminal',
      source: 'esempio',
      title: 'bash · cartella-prova',
      steps: [
        { kind: 'command', text: 'claude -c' },
        {
          kind: 'output',
          text: '↩ Conversazione ripresa: «Leggi @LEGGIMI.md e aggiungi in fondo una riga…»',
          tone: 'info',
          observe: [4],
          note: 'Senza -c si parte da zero; con -r si sceglie da un elenco.',
        },
      ],
    },
  ],
};
