import type { Exercise } from '../types';

export const DISCOUNT_RULES =
  'codice BENVENUTO = 10% solo sopra i 50 euro; codice VIP = 20% senza minimi; codici sconosciuti = nessuno sconto; il totale non può mai diventare negativo; arrotonda a 2 decimali';

export const d4Review: Exercise = {
  id: 'd4-3',
  code: 'D4·3',
  lesson: 'Batch, revisione e cache',
  title: 'Autorevisione contro revisione indipendente',
  place: 'Claude Code',
  minutes: 8,
  goal: 'Confrontare la revisione fatta nella stessa sessione che ha scritto il documento con quella di una sessione nuova.',
  observe: [
    'La prima revisione conosce già il perché di ogni scelta: rischia di confermarle.',
    'La sessione nuova parte solo dai requisiti e dal documento.',
    'Il risultato varia: nella prova registrata l’autorevisione ha trovato più punti. Una prova sola non basta per giudicare.',
  ],
  exam: 'Bias del contesto di ragionamento: chi genera non revisiona; sessione indipendente.',
  scenes: [
    {
      id: 'scrittura',
      label: '1. Scrivere la procedura',
      description:
        'Claude scrive una procedura sugli sconti partendo da cinque regole. Sotto la richiesta si vedono alcuni passaggi salvati nel documento.',
      simulator: 'code',
      source: 'reale',
      title: 'cartella-prova · sessione 1 · modello sonnet',
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: `Scrivi in procedure/sconti.md una breve procedura per gli operatori con queste regole: ${DISCOUNT_RULES}. Procedi senza fare domande.`,
        },
        {
          kind: 'tool',
          name: 'Write',
          input: 'procedure\\sconti.md',
          result:
            '[…]\n3. Se il codice è BENVENUTO, controlla che il totale sia superiore a 50 €. Un totale di esattamente 50 € non è valido. […]\n6. Se il risultato è negativo, imposta il totale a 0,00 €. […]\n7. Arrotonda il totale finale a 2 decimali.',
          status: 'ok',
          note: 'Domanda al team: quali casi non sono previsti?',
        },
      ],
    },
    {
      id: 'confronto',
      label: '2. Due revisioni',
      description:
        'A sinistra rivede il documento la sessione che l’ha scritto, a destra una sessione nuova che conosce solo le regole. Confrontate quanti dubbi emergono.',
      simulator: 'code',
      source: 'reale',
      title: 'stesso documento, due sessioni · modello sonnet',
      panes: ['Sessione 1 · chi ha scritto', 'Sessione 2 · indipendente'],
      steps: [
        {
          kind: 'message',
          role: 'user',
          pane: 0,
          text: 'Rivedi la procedura che hai scritto e dimmi in breve se ci sono problemi.',
        },
        {
          kind: 'message',
          role: 'assistant',
          pane: 0,
          text: '[…] Il calcolo è corretto, ma ci sono alcuni punti poco chiari:\n1. Totale di riferimento […]\n2. Flusso dei passaggi […]\n3. Arrotondamento […]\n4. Formato del codice […]\n5. Più codici […]\n6. Punto 6 […]',
          observe: [0],
        },
        {
          kind: 'message',
          role: 'user',
          pane: 1,
          text: `Rivedi procedure/sconti.md rispetto a queste regole e dimmi in breve se ci sono problemi: ${DISCOUNT_RULES}.`,
        },
        { kind: 'tool', name: 'Read', input: 'procedure\\sconti.md', status: 'ok', pane: 1, observe: [1] },
        {
          kind: 'message',
          role: 'assistant',
          pane: 1,
          text: '[…] rispetta tutte le regole che mi hai dato e non ci sono problemi. […]\nDue note minori, che non sono errori: […]',
          observe: [2],
          note: 'Risultato opposto a quello atteso: qui la sessione nuova ha controllato solo le regole date. Anche il prompt conta.',
        },
      ],
    },
  ],
};
