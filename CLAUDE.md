# CLAUDE.md

Presentation app for the CCA-F course: scripted, animated simulations. No backend and no calls to Claude.

- `src/exercises/`: one data file per exercise; source of truth for the PDFs. `p0`-`p8` cover the pre-course (`p0` introduces Claude and its tools).
- `guide/`: self-practice steps and PDF generator (`npm run pdf`).
- `src/player/`: playback engine. `playerReducer.ts` is pure and tested.
- `src/simulators/`: step rendering for terminal, chat and Claude Code.
- `src/diagrams/`: data-driven flow diagram.
- `src/lessons/`: "Animazioni" section. `data/` has one file per lesson part (pre-course P·0-P·8 and D1-D5), each with scenes made of actors and frames; `Stage.tsx` draws them, `framePlayer.ts` is pure and tested.

Rules:

- Keep lesson content in data files, not in components.
- Audience: non-programmers. No Python; only chat, Claude desktop and Claude Code in the terminal.
- Every scene needs a plain-language `description`.
- Never mark a scene `reale` unless the output was recorded from a real run.
- Colors come from the PDF palette in `src/styles.css`. No UI or animation libraries.
- UI strings and comments in Italian, identifiers in English.
- Before finishing: `npm run lint`, `npm test`, `npm run build`, `npm audit`.
