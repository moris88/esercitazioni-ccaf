# Simulatore delle esercitazioni CCA-F

App React da proiettare a lezione: anima le esercitazioni nel terminale, in chat e in Claude Code.
È tutto simulato: non chiama Claude, non esegue comandi e funziona senza rete dopo l'installazione.

Contiene 25 esercitazioni: P·0-P·8 (pre-corso) e D1·1-D5·3 (domini). Sopra ogni scena, «Cosa vediamo» spiega che cosa si vede a schermo.

## Avvio

    npm install
    npm run dev

Poi aprire l'indirizzo mostrato (di solito http://localhost:5173).

## Accesso

All'apertura il simulatore chiede utente e password, letti da due variabili d'ambiente.
Copiare `.env.example` in `.env` e impostare:

    VITE_LOGIN_USER=...
    VITE_LOGIN_PASSWORD=...

Riavviare `npm run dev` (o rifare la build) dopo ogni modifica. L'accesso vale finché la scheda del browser resta aperta.

Attenzione: è un'app senza backend, quindi i valori finiscono in chiaro nel codice JS scaricato dal browser.
Serve a evitare accessi casuali durante la presentazione, non a proteggere dati riservati.

## Comandi da tastiera

| Tasto  | Effetto                                 |
| ------ | --------------------------------------- |
| Spazio | Play / pausa                            |
| →      | Completa il testo, poi passo successivo |
| ←      | Passo precedente                        |
| R      | Ricomincia                              |

F11 mette il browser a schermo intero; la linguetta ‹ nasconde l'elenco.

## Modificare o aggiungere un'esercitazione

Ogni esercitazione è un file in `src/exercises/`, descritto dai tipi in `src/types.ts`. Per animarne una nuova:
creare il file e aggiungerlo a `src/exercises/index.ts`.

Ogni scena dichiara `source`: `reale` (output registrato), `esempio` (scritto per la lezione) o `kit`
(dati del kit). L'etichetta compare sempre nella finestra simulata.

## Verifiche

`npm run lint`, `npm test`, `npm run build`

## Generare i PDF

`npm run pdf` ricrea `Esercitazioni_pratiche.pdf` e `Guida_setup_e_avvio.pdf` nella cartella superiore (serve Microsoft Edge).
I passi per chi si esercita da solo sono in `guide/practice*.ts`; il resto arriva da `src/exercises/`.
