import { CLEAR_PROMPT, REWRITE_PROMPT, VAGUE_PROMPT } from '../src/exercises/d2Descriptions';
import { buildErrorPrompt, EMPTY_RESULT, ERROR_RESULT } from '../src/exercises/d2Errors';
import { MCP_COMMAND } from '../src/exercises/d2Mcp';
import { COUNT_COMMAND, REVIEW_COMMAND } from '../src/exercises/d3Pipeline';
import { INVOICE_PROMPT } from '../src/exercises/d4Invoice';
import { DISCOUNT_RULES } from '../src/exercises/d4Review';
import { CHAT, CODE, FOLDER, NO_FILES, type Practice } from './practice';

const RULE =
  "Regola del team: la procedura sui rimborsi la modifica solo l'ufficio legale, quindi non va toccata.";

export const domainPractice: Record<string, Practice> = {
  'd1-1': {
    needs: [FOLDER, CODE, 'Da cartella-prova: ordini/A-101.txt e spedizioni/A-101.txt'],
    steps: [
      {
        text: 'Fate una domanda che richiede più letture.',
        prompt:
          'Il mio ordine A-101 a che punto è e quando arriva? Cerca nelle cartelle ordini e spedizioni.',
      },
      { text: 'Premete Ctrl+O per vedere nel dettaglio strumenti e risultati.' },
      {
        text: 'Ripetete con un ordine che non esiste.',
        prompt: "Leggi ordini/A-999.txt e dimmi a che punto è l'ordine.",
      },
      {
        text: 'Nota: Claude Code non mostra stop_reason. Il giro si riconosce così: se Claude chiede uno strumento il loop continua, se risponde soltanto è finito.',
      },
    ],
  },
  'd1-2': {
    needs: [FOLDER, CODE, 'Da cartella-prova: i file della cartella procedure'],
    steps: [
      {
        text: 'Chiedete due ricerche indipendenti in parallelo.',
        prompt:
          'Usa due subagenti in parallelo: il primo trova le procedure senza responsabile; il secondo elenca quelle non riviste dal 2025 in poi. Poi unisci i risultati in una tabella.',
      },
      {
        text: 'Con /clear iniziate una conversazione nuova. Date la regola solo a Claude.',
        prompt: `${RULE} Avvia un subagente e chiedigli quali documenti in procedure si possono riscrivere. Non ripetergli nessuna regola. Riporta il suo elenco così com'è, in breve.`,
      },
      {
        text: 'Ancora /clear, poi passate la regola anche al subagente e confrontate gli elenchi.',
        prompt: `${RULE} Avvia un subagente passandogli per intero questa regola e chiedigli quali documenti in procedure si possono riscrivere. Riporta il suo elenco, in breve.`,
      },
    ],
  },
  'd1-3': {
    needs: [
      FOLDER,
      CODE,
      'Su Windows: Git for Windows (serve a far partire l’hook)',
      'Dal kit: kit/claude-code/hooks/blocca.sh e kit/claude-code/settings.hook.json; da cartella-prova: bozze, riservato/codici.txt, ordini/A-102.txt',
    ],
    steps: [
      {
        text: 'Fate installare l’hook a Claude e approvate le richieste di permesso.',
        prompt:
          'Copia ../kit/claude-code/hooks/blocca.sh in .claude/hooks/ e aggiungi il contenuto di ../kit/claude-code/settings.hook.json a .claude/settings.json, creandolo se manca. Non modificare il resto.',
      },
      { text: 'Uscite con /exit, riavviate claude e con /hooks verificate che l’hook PreToolUse compaia.' },
      {
        text: 'Chiedete azioni vietate. Se Claude chiede un permesso, dite di sì: deve essere l’hook a bloccare.',
        prompt: 'Cancella la cartella bozze e poi mostrami il contenuto di riservato/codici.txt',
      },
      { text: 'Chiedete un’azione permessa.', prompt: 'Mostrami il contenuto di ordini/A-102.txt' },
      {
        text: 'Limite: è un hook didattico. Riconosce i casi più comuni, non ogni modo possibile di cancellare o leggere un file.',
      },
    ],
  },
  'd1-4': {
    needs: [FOLDER, CODE, 'Da cartella-prova: procedure/rimborsi.md'],
    steps: [
      {
        text: 'Fate spiegare una procedura.',
        prompt: 'Spiegami in 3 punti cosa prevede procedure/rimborsi.md',
      },
      {
        text: 'Uscite con /exit. Aprite procedure/rimborsi.md con Blocco note (o TextEdit), cambiate 14 giorni in 20 e salvate.',
      },
      { text: 'Nel terminale riprendete la sessione.', prompt: 'claude --resume' },
      {
        text: 'Fate la domanda senza dire che il file è cambiato.',
        prompt: 'Entro quanti giorni si può chiedere il rimborso?',
      },
      {
        text: 'Ora dite che cosa è cambiato.',
        prompt: 'Ho cambiato i giorni in procedure/rimborsi.md: rileggi il file e aggiorna la spiegazione.',
      },
      {
        text: 'Uscite e aprite un ramo separato. Alla fine rimettete 14 giorni nel file.',
        prompt: 'claude --resume --fork-session',
      },
    ],
  },
  'd2-1': {
    needs: ['Tre chat nuove con Claude', NO_FILES],
    steps: [
      { text: 'Chat 1, descrizioni vaghe.', prompt: VAGUE_PROMPT },
      { text: 'Chat 2, descrizioni chiare. Confrontate la sicurezza dichiarata.', prompt: CLEAR_PROMPT },
      { text: 'Chat 3, fate riscrivere una descrizione vaga.', prompt: REWRITE_PROMPT },
    ],
  },
  'd2-2': {
    needs: ['Due chat nuove con Claude', NO_FILES],
    steps: [
      {
        text: 'Chat 1, lista vuota: la ricerca è riuscita e non c’è nulla.',
        prompt: buildErrorPrompt(EMPTY_RESULT),
      },
      { text: 'Chat 2, errore dichiarato.', prompt: buildErrorPrompt(ERROR_RESULT) },
      {
        text: 'Soppressione: immaginate che nella chat 1 il servizio fosse guasto. Il testo sarebbe identico, quindi Claude non potrebbe accorgersene.',
      },
    ],
  },
  'd2-3': {
    needs: [
      FOLDER,
      'Terminale in cartella-prova, connessione a Internet',
      'Da cartella-prova: i file della cartella procedure',
    ],
    steps: [
      { text: 'Nel terminale, fuori da Claude Code, aggiungete il server della guida.', prompt: MCP_COMMAND },
      { text: 'Aprite .mcp.json con Blocco note (o TextEdit) e leggetelo.' },
      { text: 'Avviate claude, approvate il server e controllate lo stato.', prompt: '/mcp' },
      {
        text: 'Usate il server, poi confrontate Glob e Grep.',
        prompt:
          'Usa il server docs per spiegarmi in due righe che cos’è un hook. Poi usa Glob per trovare i file .md in procedure e Grep per trovare dove compare la parola "rimborso".',
      },
    ],
  },
  'd3-1': {
    needs: [
      FOLDER,
      CODE,
      'Dal kit: kit/claude-code/rules/risposte.md; da cartella-prova: risposte/pacco-danneggiato.md e procedure/spedizioni.md',
    ],
    steps: [
      { text: 'Create CLAUDE.md e leggetelo.', prompt: '/init' },
      {
        text: 'Fate copiare la regola, poi uscite con /exit e riavviate claude.',
        prompt: 'Copia il file ../kit/claude-code/rules/risposte.md nella cartella .claude/rules',
      },
      {
        text: 'Chiedete una risposta al cliente.',
        prompt:
          'Scrivi in risposte/ritardo.md una risposta per un cliente con il pacco in ritardo. Guarda prima come sono scritte le altre risposte.',
      },
      {
        text: 'Modificate un documento fuori dalla cartella risposte.',
        prompt:
          'Aggiungi in fondo a procedure/spedizioni.md un punto 4: i pacchi danneggiati vanno fotografati.',
      },
      { text: 'Controllate i file di istruzioni caricati.', prompt: '/memory' },
    ],
  },
  'd3-2': {
    needs: [
      FOLDER,
      CODE,
      'Dal kit: kit/claude-code/skills/spiega-procedura e kit/claude-code/agents/revisore-documenti.md; da cartella-prova: i file della cartella procedure',
    ],
    steps: [
      {
        text: 'Fate installare skill e subagente, poi uscite con /exit e riavviate claude.',
        prompt:
          'Copia la cartella ../kit/claude-code/skills/spiega-procedura in .claude/skills/ e il file ../kit/claude-code/agents/revisore-documenti.md in .claude/agents/',
      },
      { text: 'Usate la skill a mano.', prompt: '/spiega-procedura procedure/rimborsi.md' },
      {
        text: 'Fate una domanda normale: la skill parte da sola.',
        prompt: 'Come funziona la procedura sulle garanzie?',
      },
      {
        text: 'Passate in plan mode con Shift+Tab e chiedete una modifica ampia. Non approvate il piano.',
        prompt:
          'In tutte le procedure sostituisci la parola "cliente" con "acquirente" e aggiungi il responsabile dove manca.',
      },
      {
        text: 'Uscite dal plan mode con Shift+Tab e chiedete una revisione.',
        prompt:
          'Usa revisore-documenti per rivedere rimborsi.md e garanzie.md nella cartella procedure. Riporta i problemi in tabella.',
      },
    ],
  },
  'd3-3': {
    needs: [
      FOLDER,
      'Terminale in cartella-prova, senza aprire Claude Code',
      'Da cartella-prova: i file della cartella procedure',
    ],
    steps: [
      { text: 'Una richiesta non interattiva (tutto su una riga).', prompt: COUNT_COMMAND },
      { text: 'Una revisione salvata in un file (tutto su una riga).', prompt: REVIEW_COMMAND },
      { text: 'Aprite revisione.json con Blocco note e cercate i campi result, num_turns e total_cost_usd.' },
      { text: 'Domanda: che cosa succederebbe senza -p?' },
    ],
  },
  'd4-1': {
    needs: ['Due chat nuove con Claude', 'Dal kit: kit/dati/email_supporto.txt'],
    steps: [
      {
        text: 'Chat 1: allegate kit/dati/email_supporto.txt e date un’istruzione vaga.',
        prompt: 'Classifica queste email di supporto per urgenza, usando il tuo miglior giudizio.',
      },
      {
        text: 'Chat 2: allegate di nuovo kit/dati/email_supporto.txt e date criteri ed esempi.',
        prompt: `Classifica ogni email in una sola categoria: RIMBORSO, SPEDIZIONE, ACCOUNT, TECNICO, ALTRO.
Urgenza ALTA solo se c'è un addebito errato o un account bloccato. NON è alta solo perché il tono è arrabbiato.
Se un'email chiede due cose, usa la categoria della richiesta economica e segnala l'altra in nota.

Esempi:
"Il pacco è arrivato rotto, voglio i soldi indietro" -> RIMBORSO, urgenza MEDIA (danno, ma nessun addebito errato)
"Ottimo servizio" -> ALTRO, urgenza BASSA (nessuna azione richiesta)

Rispondi con una tabella: numero, categoria, urgenza, motivo.`,
      },
    ],
  },
  'd4-2': {
    needs: [CHAT, 'Dal kit: kit/dati/fattura.txt e kit/dati/schema_fattura.json'],
    steps: [
      {
        text: 'Allegate kit/dati/fattura.txt e kit/dati/schema_fattura.json e chiedete i dati.',
        prompt: INVOICE_PROMPT,
      },
      {
        text: 'Sommate le righe e confrontate il risultato con l’imponibile della fattura (non con il totale, che comprende l’IVA).',
      },
    ],
  },
  'd4-3': {
    needs: [FOLDER, CODE, 'Da cartella-prova: la cartella procedure (il file sconti.md lo crea Claude)'],
    steps: [
      {
        text: 'Sessione 1: fate scrivere una procedura nuova.',
        prompt: `Scrivi in procedure/sconti.md una breve procedura per gli operatori con queste regole: ${DISCOUNT_RULES}. Procedi senza fare domande.`,
      },
      {
        text: 'Nella stessa sessione chiedete la revisione.',
        prompt: 'Rivedi la procedura che hai scritto e dimmi in breve se ci sono problemi.',
      },
      {
        text: 'Uscite con /exit, riavviate claude e chiedete una revisione indipendente.',
        prompt: `Rivedi procedure/sconti.md rispetto a queste regole e dimmi in breve se ci sono problemi: ${DISCOUNT_RULES}.`,
      },
    ],
  },
  'd5-1': {
    needs: [
      FOLDER,
      CODE,
      'Da cartella-prova: i file della cartella procedure; dal kit: kit/dati/caso_cliente.txt',
    ],
    steps: [
      { text: 'Guardate il contesto occupato.', prompt: '/context' },
      {
        text: 'Fate leggere i documenti e poi guardate di nuovo /context.',
        prompt: 'Leggi tutti i file in procedure e riassumi cosa fanno.',
      },
      {
        text: 'Con /clear ripartite, ripetete con un subagente e confrontate /context. Con pochi documenti la differenza può essere piccola.',
        prompt:
          'Usa un subagente Explore per riassumere cosa fanno i file in procedure: voglio solo il riepilogo.',
      },
      {
        text: 'Aprite kit/dati/caso_cliente.txt con Blocco note (o TextEdit), copiate tutto il testo e incollatelo in Claude Code; poi compattate.',
        prompt: '/compact Conserva alla lettera il blocco FATTI DEL CASO.',
      },
      {
        text: 'Verificate i numeri.',
        prompt: 'Qual è il totale esatto dell’ordine e il limite di rimborso automatico?',
      },
    ],
  },
  'd5-2': {
    needs: [CHAT, NO_FILES],
    steps: [
      {
        text: 'Impostate ruolo e regole.',
        prompt: `Sei l'agente di supporto di un negozio online. Regole:
- Passa a un operatore SOLO se: il cliente lo chiede esplicitamente; la richiesta non è coperta dalle policy; non fai progressi dopo due tentativi.
- Il tono arrabbiato NON è un motivo di escalation.
- Se trovi più clienti con lo stesso nome, chiedi email o ultime 4 cifre del telefono. Non indovinare.
- Puoi stornare da solo gli addebiti duplicati fino a 50 euro.
- Quando passi a un operatore, scrivi un riepilogo: cliente, problema, ordine, azioni fatte, azione consigliata.
Rispondi ai prossimi messaggi come se fossero del cliente. Clienti in archivio: Mario Rossi (mario.r@mail.it), Mario Rossi (rossi.m@mail.it).`,
      },
      {
        text: 'Caso 1, tono acceso e problema semplice.',
        prompt: 'SONO FURIOSO!!! Mi avete addebitato DUE VOLTE 4,99 euro per lo stesso ordine!!!',
      },
      {
        text: 'Caso 2, tono calmo e problema fuori policy.',
        prompt:
          'Buongiorno, sono un’azienda: possiamo avere una fattura unica mensile con pagamento a 90 giorni per tutti gli ordini dei nostri 40 dipendenti?',
      },
      {
        text: 'Caso 3, più clienti con lo stesso nome.',
        prompt: 'Sono Mario Rossi, mi dite a che punto è il mio ordine?',
      },
    ],
  },
  'd5-3': {
    needs: [CHAT, 'Dal kit: kit/dati/fonti_conflitto.txt'],
    steps: [
      {
        text: 'Allegate kit/dati/fonti_conflitto.txt e chiedete una sintesi libera.',
        prompt: 'Riassumi in due righe i ricavi del Q4 2025 di Nordica.',
      },
      {
        text: 'Poi una sintesi con provenienza.',
        prompt:
          'Ora restituisci un JSON con: per ogni affermazione claim, fonte, data_pubblicazione, data_raccolta (se nota) e livello: ben documentato, contestato o fonte singola. Se le fonti non concordano, riporta tutti i valori con la loro fonte e indica quale fa fede e perché. Aggiungi una confidenza da 0 a 1 per ogni campo.',
      },
    ],
  },
};
