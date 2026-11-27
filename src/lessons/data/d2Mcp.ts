import { box, code, frame, note, scene } from '../helpers';
import type { Lesson } from '../types';

export const d2Mcp: Lesson = {
  id: 'd2-mcp',
  group: 'd2',
  code: 'D2·3',
  title: 'MCP e strumenti integrati',
  lesson: 'Dominio 2 · Parte 3 · MCP e strumenti integrati',
  goal: 'Capire come Claude Code si collega a servizi esterni con MCP e quando usare Grep, Glob, Read ed Edit.',
  exam: 'Host coordina i client, un client per server; stdio in locale e HTTP per il remoto; .mcp.json è condiviso; segreti come ${VAR}; Grep cerca nei contenuti, Glob nei nomi.',
  scenes: [
    scene({
      id: 'architettura',
      label: 'Host, client e server',
      description: 'Claude Code parla con servizi esterni attraverso tanti collegamenti uno a uno.',
      takeaway:
        'L’host coordina i client; ogni client ha una connessione 1:1 con un server. Il server espone strumenti, risorse e prompt.',
      actors: [
        box('host', 'Host', 14, 50, { w: 20, body: 'Claude Code' }),
        box('c1', 'Client 1', 44, 26, { w: 18, from: 1 }),
        box('c2', 'Client 2', 44, 74, { w: 18, from: 1 }),
        box('s1', 'Server GitHub', 80, 26, { w: 26, from: 2 }),
        box('s2', 'Server Postgres', 80, 74, { w: 26, from: 2 }),
        code('wire', 'JSON-RPC 2.0', 'initialize → tools/list → tools/call', 62, 50, {
          w: 34,
          from: 3,
          until: 3,
        }),
        box('prim', 'Cosa espone un server', 62, 50, {
          w: 36,
          from: 4,
          body: 'strumenti · risorse (sola lettura) · prompt',
        }),
      ],
      links: [
        ['host', 'c1'],
        ['host', 'c2'],
        ['c1', 's1'],
        ['c2', 's2'],
      ],
      frames: [
        frame('L’host è l’applicazione che coordina tutto, per esempio Claude Code o un IDE.', {
          hot: ['host'],
        }),
        frame('Per ogni server crea un client: un componente che tiene una connessione dedicata.', {
          hot: ['host', 'c1', 'c2'],
        }),
        frame('I server sono programmi che offrono strumenti: uno per GitHub, uno per un database.', {
          hot: ['s1', 's2'],
        }),
        frame(
          'I messaggi viaggiano in JSON-RPC: prima ci si presenta, poi si chiede l’elenco degli strumenti, poi si chiama uno strumento.',
          {
            hot: ['c1', 's1'],
            flows: [['c1', 's1', 'tools/call']],
          },
        ),
        frame('Un server può offrire strumenti da eseguire, risorse da leggere e prompt predefiniti.', {
          hot: ['prim'],
        }),
      ],
    }),
    scene({
      id: 'ambiti',
      label: 'Dove si installa',
      description:
        'La stessa configurazione MCP può stare in quattro posti con effetti diversi su chi la vede.',
      takeaway:
        'Nel progetto (.mcp.json) è condivisa con Git; locale e utente sono personali. I segreti si scrivono come ${VARIABILE}, mai nel file.',
      actors: [
        box('local', 'Locale', 14, 16, { w: 22, body: 'predefinito\nnon condiviso' }),
        box('proj', 'Progetto', 40, 16, { w: 22, body: '.mcp.json\ncondiviso con Git', from: 1 }),
        box('user', 'Utente', 64, 16, { w: 20, body: 'tutti i tuoi progetti\nnon condiviso', from: 2 }),
        box('mgd', 'Gestito', 88, 16, { w: 18, body: 'deciso dall’IT', from: 3 }),
        code(
          'file',
          '.mcp.json',
          '"shared-api": {\n  "type": "http",\n  "url": "https://example.com/mcp",\n  "headers": { "Authorization":\n    "Bearer ${API_TOKEN}" } }',
          30,
          66,
          { w: 44, from: 4 },
        ),
        box('tr', 'Trasporto', 76, 62, {
          w: 38,
          from: 5,
          body: 'stdio: processi locali\nhttp: server remoti (OAuth)\nUn url senza type viene ignorato',
        }),
      ],
      frames: [
        frame('Dove si mette un server MCP? Il primo posto è locale: vale solo per te, in quel progetto.', {
          hot: ['local'],
        }),
        frame('Nel progetto: il file .mcp.json va in Git e il server arriva a tutto il team.', {
          hot: ['proj'],
        }),
        frame('A livello utente: lo vedi in tutti i tuoi progetti, ma gli altri no.', { hot: ['user'] }),
        frame('Gestito: lo impone l’IT per tutta l’organizzazione.', { hot: ['mgd'] }),
        frame('Dentro il file il token non si scrive: si usa ${API_TOKEN}, letto dall’ambiente.', {
          hot: ['file'],
          set: { file: { mark: 'ok' } },
        }),
        frame(
          'stdio per programmi locali, http per server remoti. Per un server remoto indica sempre il type.',
          {
            hot: ['tr'],
          },
        ),
      ],
    }),
    scene({
      id: 'integrati',
      label: 'Gli strumenti di Claude Code',
      description: 'Come Claude Code esplora una codebase e cosa fare quando una modifica non riesce.',
      takeaway:
        'Grep cerca nei contenuti, Glob nei nomi; si legge solo ciò che serve. Se Edit fallisce perché il testo non è univoco: Read e poi Write.',
      actors: [
        box('grep', 'Grep', 14, 18, { w: 20, body: 'cerca dentro i file' }),
        box('glob', 'Glob', 38, 18, { w: 20, body: 'trova file per nome', from: 1 }),
        box('read', 'Read', 62, 18, { w: 20, body: 'legge un file intero', from: 2 }),
        box('edit', 'Edit', 86, 18, { w: 20, body: 'modifica mirata', from: 3 }),
        box('s1', 'Grep: i punti di ingresso', 22, 62, { w: 34, from: 4, body: 'main, route, export' }),
        box('s2', 'Read: quei file', 58, 62, { w: 26, from: 5 }),
        box('s3', 'Segui gli import', 86, 62, { w: 24, from: 6, body: 'Grep sui moduli' }),
        note('fail', 'Edit non riesce?', 50, 90, {
          w: 70,
          from: 7,
          body: 'testo non univoco → Read del file completo, poi Write',
        }),
      ],
      links: [
        ['s1', 's2'],
        ['s2', 's3'],
      ],
      frames: [
        frame('Grep cerca nei contenuti: definizioni di funzioni, messaggi di errore, import.', {
          hot: ['grep'],
        }),
        frame('Glob cerca nei nomi: tutti i file di test, tutti i file di configurazione.', {
          hot: ['glob'],
        }),
        frame('Read legge un file intero, dopo averlo individuato.', { hot: ['read'] }),
        frame('Edit cambia solo la parte indicata, ma il testo da sostituire deve essere univoco.', {
          hot: ['edit'],
        }),
        frame('Per capire una codebase si parte dai punti di ingresso con Grep.', { hot: ['s1'] }),
        frame('Si leggono solo quei file, non tutto il progetto: sarebbe uno spreco di contesto.', {
          hot: ['s2'],
          flows: [['s1', 's2']],
        }),
        frame('Si seguono gli import, un passo alla volta, costruendo la comprensione.', {
          hot: ['s3'],
          flows: [['s2', 's3']],
        }),
        frame(
          'Se Edit non riesce perché il testo compare più volte, si legge il file intero e lo si riscrive con Write.',
          {
            hot: ['fail', 'edit'],
            set: { edit: { mark: 'no' } },
          },
        ),
      ],
    }),
  ],
};
