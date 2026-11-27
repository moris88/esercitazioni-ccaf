import { box, code, frame, note, scene } from '../helpers';
import type { Lesson } from '../types';

export const d1Hooks: Lesson = {
  id: 'd1-hook',
  group: 'd1',
  code: 'D1·3',
  title: 'Regole e hook',
  lesson: 'Dominio 1 · Parte 3 · Regole e hook',
  goal: 'Distinguere una regola scritta nel prompt da un controllo garantito dal codice, e conoscere quando e come intervengono gli hook.',
  exam: 'Conseguenze finanziarie o di sicurezza = hook (uscita 2), non prompt; il passaggio a una persona è un riepilogo strutturato.',
  scenes: [
    scene({
      id: 'hook-prompt',
      label: 'Hook o prompt?',
      description:
        'Una richiesta di rimborso passa da un controllo: prima scritto nel prompt, poi come hook.',
      takeaway:
        'Per soldi e sicurezza serve un hook: il prompt è probabilistico (quasi sempre), l’hook è deterministico (sempre).',
      actors: [
        box('claude', 'Claude', 14, 30, { w: 20, body: 'vuole rimborsare' }),
        note('rule', 'Regola nel prompt', 50, 12, {
          w: 38,
          body: '«verifica sempre l’identità prima di rimborsare»',
          from: 1,
          until: 3,
        }),
        box('refund', 'process_refund', 86, 30, { w: 24, body: 'strumento di rimborso' }),
        code(
          'hook',
          'Hook PreToolUse',
          'se get_customer non ha\nrestituito un ID verificato:\n  exit 2 → blocca',
          50,
          56,
          { w: 36, from: 4 },
        ),
        box('ok', 'Cliente verificato', 24, 88, { w: 26, from: 5, body: 'il rimborso procede' }),
        box('ko', 'Non verificato', 76, 88, { w: 28, from: 6, body: 'bloccato, nessun rimborso' }),
      ],
      links: [
        ['claude', 'refund'],
        ['claude', 'hook'],
        ['hook', 'refund'],
      ],
      frames: [
        frame('Claude sta per chiamare lo strumento che rimborsa un cliente.', { hot: ['claude', 'refund'] }),
        frame('Primo tentativo: una regola scritta nel prompt. Funziona quasi sempre.', { hot: ['rule'] }),
        frame(
          'Ma «quasi sempre» non basta per un rimborso: il modello può comunque saltarla, anche se raramente.',
          {
            hot: ['rule'],
            flows: [['claude', 'refund', 'rimborso']],
            set: { rule: { mark: 'no' } },
          },
        ),
        frame('Con una regola nel prompt il rischio di errore non è mai zero.', { hot: ['refund'] }),
        frame(
          'Soluzione: un hook PreToolUse sullo strumento di rimborso. È codice, non una richiesta al modello.',
          { hot: ['hook'], flows: [['claude', 'hook', 'process_refund?']] },
        ),
        frame('Cliente verificato: l’hook lascia passare e il rimborso procede.', {
          hot: ['hook', 'ok'],
          flows: [['hook', 'refund', 'via libera']],
          set: { ok: { mark: 'ok' } },
        }),
        frame('Non verificato: l’hook esce con codice 2 e il rimborso viene bloccato, ogni volta.', {
          hot: ['hook', 'ko'],
          set: { ko: { mark: 'no' }, refund: { body: 'mai raggiunto' } },
        }),
      ],
    }),
    scene({
      id: 'eventi',
      label: 'Eventi e tipi di hook',
      description:
        'La linea del tempo di un turno di Claude Code, con i punti in cui si può agganciare un hook.',
      takeaway:
        'PreToolUse blocca (uscita 2 o deny); PostToolUse pulisce e normalizza i risultati; la regola per tutto il team va in .claude/settings.json.',
      actors: [
        box('e1', 'SessionStart', 10, 14, { w: 17, body: 'inizio sessione' }),
        box('e2', 'UserPromptSubmit', 30, 14, { w: 19, body: 'arriva il prompt' }),
        box('e3', 'PreToolUse', 50, 14, { w: 17, body: 'prima dello strumento' }),
        box('e4', 'PostToolUse', 70, 14, { w: 17, body: 'dopo lo strumento' }),
        box('e5', 'Stop', 90, 14, { w: 14, body: 'fine del turno' }),
        code(
          'cfg',
          'settings.json',
          '"PreToolUse": [{\n  "matcher": "process_refund",\n  "hooks": [{ "type": "command",\n    "command": ".claude/hooks/check.sh" }]\n}]',
          27,
          62,
          { w: 44, from: 3 },
        ),
        code(
          'dec',
          'Decisione',
          '"permissionDecision": "deny"\n"permissionDecisionReason":\n  "Identità non verificata"',
          75,
          58,
          { w: 36, from: 4, until: 4 },
        ),
        box('where', 'Dove si configura', 75, 62, {
          w: 44,
          from: 5,
          until: 5,
          body: '~/.claude: tutti i tuoi progetti\n.claude/settings.json: tutto il team\nsettings.local.json: solo questo PC',
        }),
        box('types', 'Tipi di hook', 75, 58, {
          w: 36,
          from: 6,
          body: 'command · http · mcp_tool\nprompt · agent',
        }),
      ],
      links: [
        ['e1', 'e2'],
        ['e2', 'e3'],
        ['e3', 'e4'],
        ['e4', 'e5'],
      ],
      frames: [
        frame(
          'Un turno ha dei momenti precisi. Ognuno può far partire un hook, cioè un controllo che scrivi tu.',
          { hot: ['e1', 'e2', 'e3', 'e4', 'e5'] },
        ),
        frame(
          'PreToolUse scatta prima di uno strumento e può bloccarlo. Per questo è quello che conta di più.',
          {
            hot: ['e3'],
          },
        ),
        frame(
          'PostToolUse scatta dopo: lavora sul risultato prima che Claude lo legga, per esempio normalizza le date o toglie dati sensibili.',
          { hot: ['e4'] },
        ),
        frame(
          'Si configura in settings.json: il matcher dice su quale strumento, il comando dice che cosa eseguire.',
          { hot: ['cfg', 'e3'] },
        ),
        frame(
          'L’hook può rispondere con una decisione: allow, deny o ask. Con deny (o uscita 2) lo strumento non parte.',
          { hot: ['dec'] },
        ),
        frame('Dove metterlo? Una regola per tutto il team va nel file del progetto, condiviso con Git.', {
          hot: ['where'],
        }),
        frame(
          'Esistono cinque tipi di hook: command è il più usato; gli altri chiamano un indirizzo web, un server MCP, un modello o un subagente.',
          { hot: ['types'] },
        ),
      ],
    }),
    scene({
      id: 'consegna',
      label: 'Passare il caso a una persona',
      description: 'Quando un agente non può chiudere un caso, lo passa a un operatore con un riepilogo.',
      takeaway:
        'Il passaggio di consegne è un riepilogo strutturato con cliente, problema, azioni fatte e azione consigliata, non un rimando alla conversazione.',
      actors: [
        box('agent', 'Agente', 14, 40, { w: 20, body: 'non può decidere' }),
        box('op', 'Operatore', 86, 40, { w: 22, body: 'non ha la trascrizione' }),
        code('bad', 'Rimando', '«vedi la conversazione\nqui sopra»', 50, 18, { w: 28, from: 1, until: 2 }),
        code(
          'sum',
          'Riepilogo strutturato',
          'Cliente: Jane Doe (n. 12345)\nProblema: prodotto danneggiato\nOrdine: n. 67890, 149,99 $\nAzioni: ordine verificato, foto ok\nConsigliato: rimborso completo',
          50,
          72,
          { w: 46, from: 3 },
        ),
      ],
      links: [['agent', 'op']],
      frames: [
        frame('L’agente ha un caso che non può chiudere da solo e deve passarlo a una persona.', {
          hot: ['agent'],
        }),
        frame(
          'Se manda solo un rimando alla conversazione, l’operatore non vede nulla: di solito non ha la trascrizione.',
          { hot: ['bad', 'op'], flows: [['agent', 'op', 'vedi sopra']], set: { op: { mark: 'no' } } },
        ),
        frame('L’operatore dovrebbe ricominciare da capo: tempo perso e cliente irritato.', { hot: ['op'] }),
        frame(
          'Meglio un riepilogo che permette di agire subito: chi è, cosa è successo, cosa è già stato fatto.',
          { hot: ['sum'], flows: [['agent', 'sum']] },
        ),
        frame('Il riepilogo riporta numeri e ID esatti e dice qual è l’azione consigliata.', {
          hot: ['sum'],
          flows: [['sum', 'op', 'riepilogo']],
          set: { op: { mark: 'ok', body: 'può agire subito' } },
        }),
      ],
    }),
  ],
};
