# Simulatore delle esercitazioni CCA-F

App React da proiettare a lezione: anima le esercitazioni nel terminale, in chat e in Claude Code.
È tutto simulato: non chiama Claude, non esegue comandi e funziona senza rete dopo l'installazione.

Contiene le 17 esercitazioni della guida e 7 schede aggiuntive (P·1-P·7), una per area del pre-corso.

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
creare il file e aggiungerlo a `src/exercises/index.ts`.

Ogni scena dichiara `source`: `reale` (output registrato), `esempio` (scritto per la lezione) o `kit`
(dati del kit). L'etichetta compare sempre nella finestra simulata.

## Verifiche

`npm run lint`, `npm test`, `npm run build`
