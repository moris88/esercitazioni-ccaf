# Simulatore delle esercitazioni CCA-F

App React da proiettare a lezione: anima le esercitazioni nel terminale, in chat e in Claude Code.
È tutto simulato: non chiama Claude, non esegue comandi e funziona senza rete dopo l'installazione.

## Avvio

    npm install
    npm run dev

Poi aprire l'indirizzo mostrato (di solito http://localhost:5173).

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
creare il file, importarlo in `src/exercises/index.ts` e togliere la voce da `src/exercises/upcoming.ts`.

Ogni scena dichiara `source`: `reale` (output registrato), `esempio` (scritto per la lezione) o `kit`
(dati del kit). L'etichetta compare sempre nella finestra simulata.

## Verifiche

`npm run lint`, `npm test`, `npm run build`
