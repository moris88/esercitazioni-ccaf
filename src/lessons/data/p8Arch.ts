import { box, code, frame, scene } from '../helpers';
import type { Lesson } from '../types';

export const p8Arch: Lesson = {
  id: 'p8-architettura',
  group: 'pre',
  code: 'P·8',
  title: 'Orchestrazione, guasti ed escalation',
  lesson: 'Pre-corso · Architettura e affidabilità',
  goal: 'Vedere come i componenti collaborano, che cosa succede se uno si guasta e quando serve una persona.',
  exam: 'Mai nascondere un guasto parziale; escalation con riepilogo; lo SLA guida la scelta.',
  scenes: [
    scene({
      id: 'parallelo',
      label: 'In serie o in parallelo',
      description: 'Tre attività indipendenti, eseguite una dopo l’altra oppure insieme.',
      takeaway:
        'Attività indipendenti in parallelo: il tempo totale è quello della più lenta, non la somma di tutte.',
      actors: [
        box('t1', 'Ricerca', 18, 22, { w: 20, body: '4 secondi' }),
        box('t2', 'Analisi', 50, 22, { w: 20, from: 1, body: '3 secondi' }),
        box('t3', 'Sintesi', 82, 22, { w: 20, from: 1, body: '5 secondi' }),
        box('serie', 'In serie', 28, 70, { w: 30, from: 2, body: '4 + 3 + 5 = 12 secondi' }),
        box('par', 'In parallelo', 72, 70, { w: 30, from: 3, body: 'il più lento: 5 secondi', mark: 'ok' }),
      ],
      links: [
        ['t1', 't2'],
        ['t2', 't3'],
      ],
      frames: [
        frame('Una prima attività, che dura quattro secondi.', { hot: ['t1'] }),
        frame('Altre due attività, che non dipendono l’una dall’altra.', { hot: ['t2', 't3'] }),
        frame('Una dopo l’altra: dodici secondi in totale.', { hot: ['serie'] }),
        frame('Tutte insieme: il tempo totale è quello dell’attività più lenta, cinque secondi.', {
          hot: ['par', 't1', 't2', 't3'],
        }),
      ],
    }),
    scene({
      id: 'degradazione',
      label: 'Quando un pezzo si guasta',
      description: 'Un servizio non risponde: il sistema può nascondere il problema o dirlo chiaramente.',
      takeaway:
        'Mai nascondere un guasto parziale: si risponde con ciò che c’è e si dice chiaramente cosa manca.',
      actors: [
        box('agent', 'Assistente', 14, 40, { w: 20, body: 'prepara lo stato dell’ordine' }),
        box('ord', 'Servizio ordini', 80, 16, { w: 26, from: 1, body: 'risponde', mark: 'ok' }),
        box('sped', 'Servizio spedizioni', 80, 64, { w: 28, from: 2, body: 'non disponibile', mark: 'no' }),
        box('hide', 'Nascondere', 28, 86, {
          w: 26,
          from: 3,
          body: '«il tuo ordine è in preparazione»',
          mark: 'no',
        }),
        box('say', 'Dirlo', 66, 86, {
          w: 34,
          from: 4,
          body: '«Ordine confermato. Non riesco a vedere la spedizione: riprovo più tardi»',
          mark: 'ok',
        }),
      ],
      links: [
        ['agent', 'ord'],
        ['agent', 'sped'],
      ],
      frames: [
        frame('L’assistente deve dire al cliente a che punto è il suo ordine.', { hot: ['agent'] }),
        frame('Il servizio ordini risponde senza problemi.', {
          hot: ['ord'],
          flows: [['agent', 'ord', 'stato']],
        }),
        frame('Il servizio spedizioni invece è fuori uso.', {
          hot: ['sped'],
          flows: [['agent', 'sped', 'tracking']],
        }),
        frame('Tacere il guasto e rispondere con una frase generica dà al cliente un’informazione falsa.', {
          hot: ['hide'],
        }),
        frame('Meglio una risposta parziale e onesta: ciò che si sa, ciò che manca e cosa succede dopo.', {
          hot: ['say'],
        }),
      ],
    }),
    scene({
      id: 'escalation-sla',
      label: 'Escalation e SLA',
      description:
        'Quando un caso supera i limiti dell’agente va a una persona; e il tempo richiesto guida l’architettura.',
      takeaway:
        'Escalation con un riepilogo che permette di agire subito. Lo SLA (quanto in fretta serve la risposta) decide tra tempo reale e batch.',
      actors: [
        box('case', 'Rimborso di 800 €', 14, 24, { w: 22, body: 'limite dell’agente: 500 €' }),
        box('agent', 'Agente', 44, 24, { w: 16, from: 1, body: 'non può approvare' }),
        code('sum', 'Riepilogo', 'Cliente, ordine, importo,\nmotivo, azioni fatte,\nconsiglio', 80, 24, {
          w: 30,
          from: 2,
        }),
        box('rt', 'Tempo reale', 24, 74, { w: 30, from: 3, body: 'SLA di secondi:\nuna persona aspetta' }),
        box('batch', 'Batch', 72, 74, { w: 30, from: 4, body: 'SLA di ore:\nreport notturni' }),
      ],
      links: [
        ['case', 'agent'],
        ['agent', 'sum'],
      ],
      frames: [
        frame('Arriva un rimborso da 800 euro; l’agente può approvarne al massimo 500.', { hot: ['case'] }),
        frame('L’agente non può decidere: è il momento di passare a una persona.', {
          hot: ['agent'],
          flows: [['case', 'agent']],
        }),
        frame('Lo fa con un riepilogo completo, così la persona agisce senza ricominciare da capo.', {
          hot: ['sum'],
          flows: [['agent', 'sum', 'escalation']],
        }),
        frame('Un altro criterio di architettura è lo SLA: se una persona aspetta, serve il tempo reale.', {
          hot: ['rt'],
        }),
        frame('Se nessuno aspetta e il lavoro è grande, il batch costa meno.', { hot: ['batch'] }),
      ],
    }),
  ],
};
