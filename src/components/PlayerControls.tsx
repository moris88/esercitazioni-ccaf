import type { Player } from '../player/usePlayer';

interface PlayerControlsProps {
  player: Player;
  total: number;
}

const SPEEDS = [0.5, 1, 1.5, 2];
const BUTTON = 'rounded-lg border border-line px-4 py-2 hover:bg-sand';

export function PlayerControls({ player, total }: PlayerControlsProps) {
  const { dispatch, index, playing, finished, speed, setSpeed } = player;
  const playLabel = playing ? '❚❚ Pausa' : finished ? '↻ Rivedi' : '▶ Play';

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => dispatch({ type: 'toggle' })}
        className="w-32 rounded-lg bg-accent px-4 py-2 font-bold text-white hover:brightness-110"
      >
        {playLabel}
      </button>
      <button type="button" className={BUTTON} onClick={() => dispatch({ type: 'prev' })}>
        ← Indietro
      </button>
      <button type="button" className={BUTTON} onClick={() => dispatch({ type: 'next' })}>
        Avanti →
      </button>
      <input
        type="range"
        aria-label="Passo della simulazione"
        className="min-w-24 flex-1 accent-accent"
        min={0}
        max={total - 1}
        value={index}
        onChange={(event) => dispatch({ type: 'seek', index: Number(event.target.value) })}
      />
      <span className="w-16 text-right tabular-nums text-muted">
        {index + 1} / {total}
      </span>
      <div className="flex overflow-hidden rounded-lg border border-line">
        {SPEEDS.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={value === speed}
            onClick={() => setSpeed(value)}
            className={`px-3 py-2 ${value === speed ? 'bg-ink text-white' : 'hover:bg-sand'}`}
          >
            {value}×
          </button>
        ))}
      </div>
    </div>
  );
}
