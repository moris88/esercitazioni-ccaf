import { box, code, frame, scene } from '../helpers';
import type { Lesson } from '../types';

export const d2Errors: Lesson = {
  id: 'd2-errori',
  group: 'd2',
  code: 'D2·2',
  title: 'Errori degli strumenti',
  lesson: 'Dominio 2 · Parte 2 · Errori degli strumenti',
  goal: 'Costruire errori che aiutano l’agente a recuperare, distinguere le categorie e non confondere un risultato vuoto con un guasto.',
  exam: 'Si riprovano solo gli errori temporanei; [] con 200 è un’informazione, un timeout è un errore; mai soppressione silenziosa.',
  scenes: [
    scene({
      id: 'struttura',
      label: 'Un errore che aiuta',
      description: 'Confronto tra un errore generico e uno strutturato, e le quattro categorie di errore.',
      takeaway:
        'Un buon errore dice cosa è fallito, perché, se si può riprovare e cosa è stato ottenuto finora. Si riprovano solo gli errori temporanei.',
      actors: [
        code('bad', 'Errore generico', '"Operazione non riuscita"', 20, 14, { w: 30 }),
        code(
          'good',
          'Errore strutturato',
          '"errorCategory": "transient"\n"isRetryable": true\n"description": "Timeout dopo 30 s\n  sul database ordini"\n"attempted_action": "SELECT …"',
          74,
          30,
          { w: 44, from: 1 },
        ),
        box('c1', 'Temporaneo', 12, 70, {
          w: 20,
          from: 3,
          body: 'timeout, rate limit\n→ riprova con attesa',
        }),
        box('c2', 'Convalida', 36, 70, { w: 20, from: 3, body: 'email non valida\n→ correggi e riprova' }),
        box('c3', 'Business', 60, 70, { w: 20, from: 3, body: 'oltre il limite\n→ spiega o inoltra' }),
        box('c4', 'Autorizzazione', 84, 70, { w: 20, from: 3, body: 'token scaduto\n→ passa a una persona' }),
      ],
      frames: [
        frame('«Operazione non riuscita». Claude non sa cosa sia andato storto né cosa fare.', {
          hot: ['bad'],
          set: { bad: { mark: 'no' } },
        }),
        frame(
          'Un errore strutturato dice la categoria, se è ripetibile, cosa è successo e cosa si stava tentando.',
          {
            hot: ['good'],
            set: { good: { mark: 'ok' } },
          },
        ),
        frame('Con questi dati Claude può decidere: qui conviene riprovare.', { hot: ['good'] }),
        frame('Quattro categorie, quattro comportamenti diversi.', { hot: ['c1', 'c2', 'c3', 'c4'] }),
        frame(
          'Temporaneo: si riprova con attesa progressiva. È l’unico che si ripete senza cambiare nulla.',
          {
            hot: ['c1'],
          },
        ),
        frame(
          'Gli altri non si risolvono ritentando: si corregge l’input, si spiega la regola o si passa a una persona.',
          {
            hot: ['c2', 'c3', 'c4'],
          },
        ),
      ],
    }),
    scene({
      id: 'vuoto',
      label: 'Vuoto o errore?',
      description: 'Due situazioni che sembrano uguali ma vanno trattate in modo opposto.',
      takeaway:
        'Nessun risultato è un’informazione; un servizio giù è un errore. Mai restituire una lista vuota quando la ricerca non è stata eseguita.',
      actors: [
        box('agent', 'Agente', 14, 50, { w: 18 }),
        box('ok', 'Ricerca valida', 50, 24, { w: 28, from: 1, body: 'risponde 200 con []' }),
        box('down', 'Servizio inattivo', 50, 76, { w: 28, from: 3, body: 'timeout o 503' }),
        box('say1', '«Nessun articolo trovato»', 86, 24, { w: 24, from: 2, mark: 'ok' }),
        box('say2', '«Non riesco a cercare, riprovo»', 86, 76, { w: 24, from: 4, mark: 'ok' }),
        box('silent', 'Soppressione silenziosa', 86, 50, {
          w: 24,
          from: 5,
          body: '[] anche se il servizio è giù',
          mark: 'no',
        }),
      ],
      links: [
        ['agent', 'ok'],
        ['agent', 'down'],
        ['ok', 'say1'],
        ['down', 'say2'],
      ],
      frames: [
        frame('L’agente cerca informazioni con uno strumento di ricerca.', { hot: ['agent'] }),
        frame('Caso uno: la ricerca funziona e semplicemente non trova nulla.', {
          hot: ['ok'],
          flows: [['agent', 'ok', 'cerca']],
        }),
        frame('È un’informazione utile: l’agente può dire che non esistono articoli corrispondenti.', {
          hot: ['say1'],
          flows: [['ok', 'say1', '[]']],
        }),
        frame('Caso due: il servizio non risponde. La ricerca non è mai stata eseguita.', {
          hot: ['down'],
          flows: [['agent', 'down', 'cerca']],
        }),
        frame(
          'Questo è un errore: l’agente deve dire che non è riuscito a cercare e provare un’altra strada.',
          {
            hot: ['say2'],
            flows: [['down', 'say2', 'errore']],
          },
        ),
        frame(
          'L’errore da evitare: restituire una lista vuota anche se il servizio è giù. L’agente direbbe «non ho trovato nulla» ed è falso.',
          {
            hot: ['silent'],
          },
        ),
      ],
    }),
    scene({
      id: 'antipattern',
      label: 'Antipattern e strumenti in parallelo',
      description:
        'Quattro errori da non fare e cosa succede quando più strumenti girano insieme o sul lato server.',
      takeaway:
        'Tutti i risultati in un solo messaggio, errori inclusi. Anche con HTTP 200 una chiamata può essere fallita: controlla il blocco del risultato.',
      actors: [
        box('a1', 'Messaggio generico', 16, 16, { w: 26, body: '«Operazione non riuscita»', mark: 'no' }),
        box('a2', 'Soppressione silenziosa', 50, 16, {
          w: 26,
          body: '[] a servizio giù',
          mark: 'no',
          from: 1,
        }),
        box('a3', 'Stato generico', 84, 16, {
          w: 26,
          body: '«Ricerca non disponibile»',
          mark: 'no',
          from: 2,
        }),
        box('a4', 'Stop al primo errore', 50, 44, {
          w: 30,
          body: 'meglio usare i risultati parziali',
          mark: 'no',
          from: 3,
        }),
        code(
          'par',
          'Un solo messaggio utente',
          'tool_result A: ok\ntool_result B: is_error: true\ntool_result C: ok',
          26,
          80,
          { w: 42, from: 4 },
        ),
        code('srv', 'Strumento lato server', 'HTTP 200\nresult: max_uses_exceeded', 76, 80, {
          w: 36,
          from: 5,
        }),
      ],
      frames: [
        frame('Primo errore da non fare: un messaggio generico che nasconde la causa.', { hot: ['a1'] }),
        frame('Secondo: la soppressione silenziosa, cioè un risultato vuoto quando il servizio è giù.', {
          hot: ['a2'],
        }),
        frame('Terzo: uno stato troppo generico, senza dire che cosa si stava tentando.', { hot: ['a3'] }),
        frame('Quarto: fermare tutto al primo errore invece di usare ciò che si è già ottenuto.', {
          hot: ['a4'],
        }),
        frame(
          'Con più strumenti in parallelo, tutti i risultati vanno in un solo messaggio. Quello fallito resta, con is_error.',
          {
            hot: ['par'],
            set: { par: { mark: 'ok' } },
          },
        ),
        frame(
          'Gli strumenti lato server (ricerca web) segnalano gli errori dentro il risultato, anche con HTTP 200: controlla il blocco prima di usarlo.',
          {
            hot: ['srv'],
          },
        ),
      ],
    }),
  ],
};
