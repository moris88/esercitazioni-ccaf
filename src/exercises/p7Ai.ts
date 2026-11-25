import type { Diagram, Exercise } from '../types';

const rag: Diagram = {
  nodes: [
    { id: 'question', label: 'Domanda', x: 62, y: 40 },
    { id: 'search', label: 'Recupero', x: 258, y: 40 },
    { id: 'prompt', label: 'Prompt', x: 258, y: 175 },
    { id: 'answer', label: 'Risposta', x: 62, y: 175 },
  ],
  edges: [
    { from: 'question', to: 'search' },
    { from: 'search', to: 'prompt' },
    { from: 'prompt', to: 'answer' },
  ],
};

export const p7Ai: Exercise = {
  id: 'p-7',
  code: 'P·7',
  lesson: 'Pre-corso · Documenti e IA',
  title: 'OCR, token, allucinazioni, RAG e few-shot',
  place: 'Claude (app o claude.ai)',
  minutes: 10,
  goal: 'Capire da dove nascono gli errori quando un modello lavora su documenti e conversazioni lunghe.',
  observe: [
    'Se l’errore è dell’OCR, nessun prompt lo corregge: si valida il dato e, se è incerto, lo vede una persona.',
    'L’API è stateless: a ogni chiamata si rimanda tutta la conversazione, quindi il contesto cresce.',
    'Permettere «non lo so» o null riduce le allucinazioni.',
    'Nella RAG, se il recupero porta i pezzi sbagliati, anche la risposta è sbagliata.',
    'Gli esempi (few-shot) mostrano il formato e chiariscono i casi limite.',
  ],
  exam: 'null invece di inventare; validazione nel codice; numeri importanti conservati a parte.',
  scenes: [
    {
      id: 'ocr',
      label: '1. OCR',
      description:
        'Una fattura letta da una scansione, con lettere al posto dei numeri. La tabella mostra i controlli che intercettano l’errore.',
      simulator: 'terminal',
      source: 'esempio',
      title: 'fattura scansionata',
      steps: [
        { kind: 'output', text: 'Originale   Totale 1.500,00   Fattura N. 10085' },
        { kind: 'output', text: 'Testo OCR   Totale 1.S00,00   Fattura N. IOO8S', tone: 'error' },
        {
          kind: 'table',
          columns: ['Campo', 'Letto', 'Controllo nel codice'],
          rows: [
            ['totale', '1.S00,00', 'non è un numero → revisione'],
            ['numero', 'IOO8S', 'non rispetta \\d{5} → revisione'],
          ],
          observe: [0],
          note: 'Claude può anche leggere direttamente l’immagine, ma il dato va comunque validato.',
        },
      ],
    },
    {
      id: 'token',
      label: '2. Token e contesto',
      description:
        'La barra indica quanto spazio della conversazione è occupato. Cresce a ogni giro e scende dopo la compattazione.',
      simulator: 'code',
      source: 'esempio',
      title: 'conversazione che cresce',
      steps: [
        { kind: 'meter', label: 'Giro 1: prompt di sistema + domanda', percent: 8 },
        { kind: 'meter', label: 'Giro 5: + risultati degli strumenti', percent: 41 },
        {
          kind: 'meter',
          label: 'Giro 12: + documenti',
          percent: 86,
          observe: [1],
          note: 'Anche prima di riempirsi, un contesto lungo e disordinato rende meno precisi. Percentuali di esempio.',
        },
        {
          kind: 'meter',
          label: 'Dopo la compattazione',
          percent: 22,
          note: 'Un riassunto può perdere numeri, date e identificativi: vanno conservati a parte.',
        },
      ],
    },
    {
      id: 'allucinazioni',
      label: '3. Allucinazioni',
      description:
        'La stessa fattura con due richieste diverse. A sinistra Claude è spinto a rispondere e inventa, a destra può dire che il dato manca.',
      simulator: 'chat',
      source: 'esempio',
      title: 'stessa fattura, due prompt',
      panes: ['Prompt che spinge a rispondere', 'Prompt che ammette il vuoto'],
      steps: [
        {
          kind: 'message',
          role: 'user',
          pane: 0,
          attachment: 'fattura.txt',
          text: 'Dammi il numero d’ordine di acquisto. Rispondi sempre con un valore.',
        },
        {
          kind: 'message',
          role: 'assistant',
          pane: 0,
          text: 'Il numero d’ordine è PO-2026-118.',
          note: 'Plausibile e sicuro, ma nella fattura quel numero non c’è.',
        },
        {
          kind: 'message',
          role: 'user',
          pane: 1,
          attachment: 'fattura.txt',
          text: 'Dammi il numero d’ordine di acquisto. Usa solo il documento; se manca, rispondi null.',
        },
        { kind: 'message', role: 'assistant', pane: 1, text: 'null', observe: [2] },
      ],
    },
    {
      id: 'rag',
      label: '4. RAG',
      description:
        'Claude risponde usando pagine recuperate da un manuale. La prima volta la pagina è giusta, la seconda no.',
      simulator: 'terminal',
      source: 'esempio',
      title: 'domande sul manuale aziendale',
      diagram: rag,
      steps: [
        { kind: 'output', text: 'Domanda: «Come posso riavere i miei soldi?»', path: ['question'] },
        {
          kind: 'output',
          text: 'Recupero: «Procedura di rimborso», pag. 12',
          tone: 'info',
          path: ['question', 'search'],
          note: 'Nessuna parola in comune: la ricerca semantica confronta il significato.',
        },
        {
          kind: 'output',
          text: 'Risposta: il rimborso si chiede entro 14 giorni [pag. 12]',
          path: ['search', 'prompt', 'answer'],
        },
        { kind: 'divider', text: 'Recupero sbagliato' },
        {
          kind: 'output',
          text: 'Recupero: «Rimborsi spese dei dipendenti», pag. 40',
          tone: 'error',
          path: ['question', 'search'],
        },
        {
          kind: 'output',
          text: 'Risposta: compila il modulo note spese [pag. 40]',
          tone: 'error',
          path: ['search', 'prompt', 'answer'],
          observe: [3],
          note: 'La risposta è fedele al pezzo trovato: il problema è il recupero. La citazione aiuta ad accorgersene.',
        },
      ],
    },
    {
      id: 'few-shot',
      label: '5. Few-shot',
      description:
        'Un messaggio con tre esempi già risolti, poi un’email nuova. Claude segue lo schema degli esempi.',
      simulator: 'chat',
      source: 'esempio',
      title: 'nuova chat',
      steps: [
        {
          kind: 'message',
          role: 'user',
          text: `Classifica l'email con una sola parola.
<esempi>
Il pacco è arrivato rotto, voglio i soldi indietro. -> rimborso
Posso cambiare l'indirizzo di consegna? -> spedizione
Voglio un rimborso e un nuovo indirizzo. -> rimborso
</esempi>
<email>Rimborsatemi e poi spedite all'ufficio.</email>`,
          note: 'Il terzo esempio copre il caso limite: due richieste nella stessa email.',
        },
        { kind: 'message', role: 'assistant', text: 'rimborso', observe: [4] },
      ],
    },
  ],
};
