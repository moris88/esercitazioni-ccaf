import type { Exercise } from '../types';

export const p4Shell: Exercise = {
  id: 'p-4',
  code: 'P·4',
  lesson: 'Pre-corso · Riga di comando',
  title: 'Flag, stdin, exit code, glob e permessi',
  place: 'Claude (app o claude.ai)',
  minutes: 8,
  goal: 'Capire i meccanismi del terminale su cui si basano hook, pipeline e server MCP.',
  observe: [
    'La pipe passa l’output di un comando come input (stdin) del successivo; > lo salva in un file.',
    'Exit code 0 significa successo; un hook di Claude Code blocca l’azione con il codice 2.',
    'I segreti stanno nelle variabili d’ambiente, non nei file del repository.',
    'Il glob seleziona file per nome; la regex cerca schemi dentro il testo.',
    'Una regola deny blocca davvero; una frase nel prompt è solo una richiesta.',
  ],
  exam: 'Hook = JSON su stdin ed exit code; segreti con ${VARIABILE}; privilegio minimo.',
  scenes: [
    {
      id: 'pipe',
      label: '1. Flag, pipe e redirect',
      description:
        'Nel terminale, un file viene passato a Claude e la risposta salvata in un altro file, tutto con una riga.',
      simulator: 'terminal',
      source: 'esempio',
      title: 'bash',
      steps: [
        {
          kind: 'command',
          text: 'cat log.txt | claude -p "riassumi gli errori" --output-format json > risultato.json',
          note: '| collega due programmi, -p e --output-format sono flag, > salva su file.',
        },
        { kind: 'command', text: 'cat risultato.json' },
        {
          kind: 'output',
          text: '{"type": "result", "result": "Due errori di connessione al database", …}',
          tone: 'info',
          observe: [0],
        },
      ],
    },
    {
      id: 'exit',
      label: '2. stdin ed exit code',
      description:
        'Si prova a mano l’hook del kit con due richieste finte. Il numero alla fine dice se l’azione è permessa (0) o bloccata (2).',
      simulator: 'terminal',
      source: 'esempio',
      title: 'l’hook del kit, provato a mano',
      steps: [
        {
          kind: 'command',
          text: 'echo \'{"tool_input":{"command":"ls ordini"}}\' | bash blocca.sh; echo $?',
        },
        { kind: 'output', text: '0', tone: 'info', note: 'Nessun messaggio, codice 0: nessuna obiezione.' },
        {
          kind: 'command',
          text: 'echo \'{"tool_input":{"command":"rm -r bozze"}}\' | bash blocca.sh; echo $?',
        },
        {
          kind: 'output',
          text: "Bloccato dall'hook: cancellare file non è permesso.",
          tone: 'error',
        },
        {
          kind: 'output',
          text: '2',
          tone: 'error',
          observe: [1],
          note: 'Il JSON entra da stdin, il motivo esce da stderr, la decisione è l’exit code.',
        },
      ],
    },
    {
      id: 'env',
      label: '3. Variabili d’ambiente',
      description:
        'Due modi di scrivere un token segreto nella configurazione: a sinistra in chiaro, a destra con un riferimento che non lo rivela.',
      simulator: 'terminal',
      source: 'esempio',
      title: '.mcp.json a confronto',
      panes: ['Da evitare', 'Corretto'],
      steps: [
        { kind: 'output', pane: 0, text: '"env": {\n  "GITHUB_TOKEN": "token-in-chiaro"\n}', tone: 'error' },
        {
          kind: 'output',
          pane: 0,
          text: 'git add .mcp.json → il segreto finisce nella storia',
          tone: 'muted',
          note: 'Toglierlo in un commit successivo non basta: il token va revocato.',
        },
        {
          kind: 'output',
          pane: 1,
          text: '"env": {\n  "GITHUB_TOKEN": "${GITHUB_TOKEN}"\n}',
          tone: 'info',
          observe: [2],
          note: 'Il file si può condividere: ognuno imposta il proprio valore sulla sua macchina.',
        },
      ],
    },
    {
      id: 'glob',
      label: '4. Glob e regex',
      description:
        'In alto un modello che trova file per nome, sotto un modello che riconosce un testo. La tabella mostra che cosa corrisponde.',
      simulator: 'terminal',
      source: 'esempio',
      title: 'cartella-prova',
      steps: [
        { kind: 'output', text: 'glob  procedure/*.md', tone: 'info' },
        { kind: 'output', text: 'Archivio-listino-2023.md  garanzie.md  rimborsi.md  spedizioni.md' },
        { kind: 'output', text: 'regex  FATT-\\d{4}-\\d{6}', tone: 'info' },
        {
          kind: 'table',
          columns: ['Testo', 'Corrisponde?'],
          rows: [
            ['FATT-2026-000123', 'sì'],
            ['FATT-26-123', 'no: poche cifre'],
            ['FATT-9999-000000', 'sì, anche se l’anno è improbabile'],
          ],
          observe: [3],
          note: 'La regex è deterministica, ma controlla la forma e non il significato.',
        },
      ],
    },
    {
      id: 'permessi',
      label: '5. Permessi',
      description:
        'In alto le regole dei permessi: consenti, chiedi, nega. Sotto, tre azioni di Claude trattate in tre modi diversi.',
      simulator: 'code',
      source: 'esempio',
      title: 'settings.json del progetto',
      steps: [
        {
          kind: 'output',
          text: '"allow": ["Bash(npm test)"],\n"ask":   ["Bash(git commit*)"],\n"deny":  ["Read(./.env)", "Bash(git push*)"]',
          tone: 'muted',
        },
        {
          kind: 'tool',
          name: 'Bash',
          input: 'npm test',
          result: 'eseguito senza chiedere (allow)',
          status: 'ok',
        },
        {
          kind: 'permission',
          question: 'Bash(git commit -m "…") — Vuoi procedere?',
          options: ['Sì', 'No'],
          choice: 1,
        },
        {
          kind: 'tool',
          name: 'Bash',
          input: 'git push',
          result: 'Permesso negato dalle impostazioni (deny)',
          status: 'blocked',
          observe: [4],
        },
      ],
    },
  ],
};
