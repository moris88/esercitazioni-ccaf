import { box, code, frame, note, scene } from '../helpers';
import type { Lesson } from '../types';

export const d1Loop: Lesson = {
  id: 'd1-loop',
  group: 'd1',
  code: 'D1·1',
  title: 'Il loop agentico',
  lesson: 'Dominio 1 · Parte 1 · Il loop agentico',
  goal: 'Capire che un agente è un ciclo: Claude decide, il codice esegue, e stop_reason dice quando fermarsi.',
  exam: 'Il loop termina su stop_reason; testo e tool_use possono coesistere; refusal è un arresto, non un errore.',
  scenes: [
    scene({
      id: 'loop',
      label: 'Il ciclo',
      description: 'Il tuo codice, Claude e uno strumento si passano messaggi finché Claude ha la risposta.',
      takeaway:
        'Un agente è un loop: Claude decide quale strumento usare, il codice lo esegue, e si ripete finché Claude ha finito.',
      actors: [
        box('app', 'Il tuo codice', 15, 50, { body: 'Esegue il ciclo' }),
        box('claude', 'Claude', 50, 20, { body: 'Decide cosa fare' }),
        box('tool', 'Strumento', 85, 50, { body: 'es. meteo' }),
        code('stop', 'stop_reason', '', 50, 80, { w: 30, from: 2 }),
      ],
      links: [
        ['app', 'claude'],
        ['claude', 'app'],
        ['app', 'tool'],
        ['tool', 'app'],
      ],
      frames: [
        frame('Il tuo codice manda a Claude la domanda e l’elenco degli strumenti che può usare.', {
          hot: ['app', 'claude'],
          flows: [['app', 'claude', 'domanda + strumenti']],
        }),
        frame('Claude decide da solo: per sapere che tempo fa gli serve lo strumento meteo, e lo chiede.', {
          hot: ['claude'],
          flows: [['claude', 'app', 'voglio usare: meteo']],
        }),
        frame(
          'Il codice legge stop_reason. Vale "tool_use": significa «esegui lo strumento e torna da me».',
          {
            hot: ['stop', 'app'],
            set: { stop: { body: 'stop_reason = "tool_use"\n→ il ciclo continua' } },
          },
        ),
        frame('Il codice esegue lo strumento e ottiene il risultato: 15 gradi, nuvoloso.', {
          hot: ['app', 'tool'],
          flows: [['app', 'tool', 'get_weather']],
        }),
        frame('Il risultato torna a Claude. Si apre un nuovo giro del ciclo.', {
          hot: ['app', 'claude'],
          flows: [['app', 'claude', 'tool_result: 15°C']],
        }),
        frame('Ora Claude ha tutto ciò che serve: risponde in testo e stop_reason diventa "end_turn".', {
          hot: ['claude', 'stop'],
          flows: [['claude', 'app', 'risposta finale']],
          set: { stop: { body: 'stop_reason = "end_turn"\n→ il ciclo finisce' } },
        }),
        frame(
          'Nessuno ha scritto i passi in anticipo: ogni giro lo ha deciso Claude. È diverso da un flusso fisso.',
          {
            hot: ['claude'],
            set: { claude: { mark: 'ok' } },
          },
        ),
      ],
    }),
    scene({
      id: 'stop-reason',
      label: 'stop_reason',
      description:
        'Ogni risposta di Claude porta un motivo di arresto. Il codice sceglie cosa fare in base a quello.',
      takeaway: 'Si dirama sempre su stop_reason prima di leggere il contenuto della risposta.',
      actors: [
        box('resp', 'Risposta di Claude', 14, 50, { w: 22, body: 'arriva con un\nstop_reason' }),
        box('r1', 'tool_use', 52, 14, { w: 22, body: 'Claude vuole uno strumento' }),
        box('r2', 'end_turn', 52, 38, { w: 22, body: 'Claude ha finito' }),
        box('r3', 'pause_turn · max_tokens', 52, 62, { w: 26, body: 'limite raggiunto' }),
        box('r4', 'refusal', 52, 86, { w: 22, body: 'rifiuto per sicurezza' }),
        box('a1', 'Esegui e continua', 86, 14, { w: 22 }),
        box('a2', 'Mostra la risposta', 86, 38, { w: 22 }),
        box('a3', 'Rimanda o continua', 86, 62, { w: 22 }),
        box('a4', 'Fermati: non ritentare', 86, 86, { w: 22 }),
      ],
      links: [
        ['resp', 'r1'],
        ['resp', 'r2'],
        ['resp', 'r3'],
        ['resp', 'r4'],
        ['r1', 'a1'],
        ['r2', 'a2'],
        ['r3', 'a3'],
        ['r4', 'a4'],
      ],
      frames: [
        frame(
          'Ogni risposta di Claude contiene un motivo di arresto: stop_reason. È il segnale che guida il codice.',
          {
            hot: ['resp'],
          },
        ),
        frame(
          '"tool_use": Claude vuole usare uno strumento. Il codice lo esegue, restituisce il risultato e il ciclo continua.',
          {
            hot: ['r1', 'a1'],
            flows: [['resp', 'r1']],
          },
        ),
        frame('"end_turn": Claude ha finito. Si mostra la risposta e il ciclo termina.', {
          hot: ['r2', 'a2'],
          flows: [['resp', 'r2']],
        }),
        frame(
          '"pause_turn" e "max_tokens": un limite è stato raggiunto. Si rimanda la risposta o si chiede di continuare.',
          {
            hot: ['r3', 'a3'],
            flows: [['resp', 'r3']],
          },
        ),
        frame(
          '"refusal": Claude ha rifiutato per sicurezza. Arriva comunque come risposta normale, senza errori.',
          {
            hot: ['r4', 'a4'],
            flows: [['resp', 'r4']],
            set: { r4: { mark: 'no' } },
          },
        ),
        frame(
          'Un rifiuto è un arresto definitivo per quella richiesta: non è un guasto da ritentare. Si guarda stop_reason prima del contenuto.',
          {
            hot: ['resp', 'a4'],
          },
        ),
      ],
    }),
    scene({
      id: 'risposta',
      label: 'Testo e strumenti',
      description:
        'Una risposta può contenere testo e richiesta di strumento insieme; i risultati tornano con lo stesso ID.',
      takeaway:
        'Il testo non vuol dire «ho finito». Ogni risultato riporta lo stesso tool_use_id, tutti nello stesso messaggio.',
      actors: [
        code(
          'req',
          'Risposta di Claude',
          'testo: "Controllo il meteo…"\ntool_use: get_weather\n  id: toolu_01A',
          22,
          28,
          { w: 36 },
        ),
        code(
          'res',
          'Risultato che torna',
          'tool_result\n  tool_use_id: toolu_01A\n  content: "15°C, nuvoloso"',
          22,
          74,
          { w: 36, from: 2 },
        ),
        code(
          'err',
          'Se lo strumento fallisce',
          'tool_result\n  tool_use_id: toolu_01A\n  is_error: true\n  content: "Timeout dopo 30 s"',
          74,
          74,
          { w: 36, from: 4 },
        ),
        note('n1', 'Testo + strumento', 74, 28, {
          w: 30,
          body: 'Claude spiega e chiama\nnella stessa risposta',
          from: 1,
        }),
      ],
      links: [['req', 'res']],
      frames: [
        frame(
          'Quando Claude vuole uno strumento, la risposta contiene due blocchi: un testo e una richiesta di strumento.',
          {
            hot: ['req'],
          },
        ),
        frame('Il testo è solo una spiegazione. Vedere del testo non significa che Claude abbia finito.', {
          hot: ['req', 'n1'],
        }),
        frame(
          'Il codice esegue lo strumento e rimanda il risultato con lo stesso ID della richiesta: così Claude lo abbina.',
          {
            hot: ['res'],
            flows: [['req', 'res', 'stesso ID']],
          },
        ),
        frame('Se Claude chiede più strumenti insieme, tutti i risultati tornano nello stesso messaggio.', {
          hot: ['res'],
        }),
        frame(
          'Se uno strumento fallisce, si risponde comunque con is_error: true. Claude capisce che è fallito e valuta come recuperare.',
          {
            hot: ['err'],
            set: { err: { mark: 'no' } },
          },
        ),
      ],
    }),
    scene({
      id: 'errori',
      label: 'Tre errori e chi esegue il ciclo',
      description: 'Tre modi sbagliati di fermare il ciclo, e i quattro modi di far girare un agente.',
      takeaway:
        'Il ciclo termina su stop_reason, non sul testo e non su un contatore. Scegli il livello più semplice che funziona.',
      actors: [
        box('e1', 'Leggere il testo', 18, 22, {
          w: 26,
          body: '«se scrive "ho finito", esci»',
          mark: 'no',
          from: 1,
        }),
        box('e2', 'Contare i giri', 50, 22, {
          w: 26,
          body: '«al massimo 5 cicli»\nok solo come freno di sicurezza',
          mark: 'no',
          from: 2,
        }),
        box('e3', 'Testo = fine', 82, 22, { w: 26, body: '«se c’è testo, ha finito»', mark: 'no', from: 3 }),
        box('good', 'stop_reason', 50, 50, {
          w: 30,
          body: 'l’unico segnale affidabile',
          from: 4,
          mark: 'ok',
        }),
        box('w1', 'Ciclo a mano', 15, 82, { w: 22, body: 'scrivi tutto tu', from: 5 }),
        box('w2', 'Tool Runner', 38, 82, { w: 20, body: 'l’SDK fa il ciclo', from: 5 }),
        box('w3', 'Agent SDK', 61, 82, { w: 20, body: 'Claude Code come libreria', from: 5 }),
        box('w4', 'Managed Agents', 84, 82, { w: 22, body: 'Anthropic lo ospita', from: 5 }),
      ],
      frames: [
        frame('Tre errori tipici quando si scrive il ciclo. Vediamoli uno alla volta.'),
        frame(
          'Primo: leggere il testo per capire se Claude ha finito. Il linguaggio naturale non è un segnale affidabile.',
          {
            hot: ['e1'],
          },
        ),
        frame(
          'Secondo: fermarsi dopo un numero fisso di giri. Va bene come limite di sicurezza, non come regola principale.',
          {
            hot: ['e2'],
          },
        ),
        frame(
          'Terzo: considerare finito il lavoro perché c’è del testo. Una risposta può avere testo e richiesta di strumento.',
          {
            hot: ['e3'],
          },
        ),
        frame('La regola giusta è una sola: guarda stop_reason.', { hot: ['good'] }),
        frame(
          'Chi esegue il ciclo? Dal più manuale al più gestito: lo scrivi tu, lo fa l’SDK, lo fa Claude Code come libreria, o lo ospita Anthropic. Scegli il più semplice che basta.',
          {
            hot: ['w1', 'w2', 'w3', 'w4'],
          },
        ),
      ],
    }),
  ],
};
