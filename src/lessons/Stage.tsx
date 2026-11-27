import type { CSSProperties } from 'react';
import { resolveFrame } from './resolve';
import type { Actor, LessonScene } from './types';

interface StageProps {
  scene: LessonScene;
  index: number;
}

const DEFAULT_WIDTH = 20;
/** La scena è larga il doppio dell'altezza ridotta di un quarto: le frecce usano queste unità */
const VIEW_WIDTH = 160;
const VIEW_HEIGHT = 90;

const toView = ({ x, y }: Actor) => ({ cx: (x * VIEW_WIDTH) / 100, cy: (y * VIEW_HEIGHT) / 100 });

function actorClasses({ kind = 'box' }: Actor, hot: boolean): string {
  if (kind === 'code') {
    return `${hot ? 'border-accent ring-2 ring-accent' : 'border-ink'} bg-ink text-left font-mono text-sand`;
  }
  if (kind === 'pill') {
    return `${hot ? 'border-accent bg-accent text-white' : 'border-line bg-white'} rounded-full`;
  }
  if (kind === 'note') {
    return `${hot ? 'border-accent bg-accent text-white' : 'border-accent/40 bg-blush'} border-dashed`;
  }
  return hot ? 'border-accent bg-accent text-white' : 'border-line bg-sand';
}

function ActorView({ actor, hot }: { actor: Actor; hot: boolean }) {
  const { label, body, kind = 'box', value, mark, x, y, w = DEFAULT_WIDTH } = actor;
  const style: CSSProperties = { left: `${x}%`, top: `${y}%`, width: `${w}%` };
  return (
    <div
      style={style}
      className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 animate-enter rounded-xl border-2 px-3 py-2 text-center text-[0.8rem] leading-snug shadow-sm transition-colors duration-300 2xl:text-base ${actorClasses(actor, hot)}`}
    >
      <p className={`font-bold ${kind === 'code' ? 'text-xs text-blush uppercase' : ''}`}>{label}</p>
      {body && (
        <p
          className={`whitespace-pre-line ${kind === 'code' ? 'mt-1 text-xs 2xl:text-sm' : `mt-0.5 text-xs 2xl:text-sm ${hot ? 'text-white/90' : 'text-muted'}`}`}
        >
          {body}
        </p>
      )}
      {kind === 'meter' && value !== undefined && (
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-white">
          <div
            className={`h-full rounded-full transition-[width] duration-700 ${hot ? 'bg-ink' : 'bg-accent'}`}
            style={{ width: `${value}%` }}
          />
        </div>
      )}
      {mark && (
        <span
          role="img"
          aria-label={mark === 'ok' ? 'corretto' : 'errato'}
          className={`absolute -top-3 -right-3 flex size-7 items-center justify-center rounded-full border-2 border-white text-sm font-bold text-white ${mark === 'ok' ? 'bg-ink' : 'bg-accent'}`}
        >
          {mark === 'ok' ? '✓' : '✕'}
        </span>
      )}
    </div>
  );
}

export function Stage({ scene, index }: StageProps) {
  const { actors, hot, flows } = resolveFrame(scene, index);
  const byId = new Map(actors.map((actor) => [actor.id, actor]));
  const isFlowing = (from: string, to: string) => flows.some(([a, b]) => a === from && b === to);

  return (
    <div className="relative mx-auto aspect-video w-full max-w-[calc((100vh_-_24rem)*16/9)] rounded-xl border border-line bg-white">
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        className="absolute inset-0 size-full"
        role="img"
        aria-label="Schema della scena"
      >
        <defs>
          <marker
            id="head"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto"
          >
            <path d="M0 0L10 5L0 10z" className="fill-muted" />
          </marker>
        </defs>
        {scene.links.map(([from, to]) => {
          const start = byId.get(from);
          const end = byId.get(to);
          if (!start || !end) return null;
          const a = toView(start);
          const b = toView(end);
          const active = isFlowing(from, to);
          const mid = `${(a.cx + b.cx) / 2} ${(a.cy + b.cy) / 2}`;
          return (
            <path
              key={`${from}-${to}`}
              d={`M${a.cx} ${a.cy}L${mid}L${b.cx} ${b.cy}`}
              fill="none"
              strokeWidth={active ? 0.9 : 0.6}
              strokeDasharray={active ? '3 3' : undefined}
              markerMid="url(#head)"
              className={active ? 'animate-flow stroke-accent' : 'stroke-line'}
            />
          );
        })}
      </svg>
      {actors.map((actor) => (
        <ActorView key={actor.id} actor={actor} hot={hot.has(actor.id)} />
      ))}
      {flows.map(([from, to, text]) => {
        const start = byId.get(from);
        const end = byId.get(to);
        if (!start || !end) return null;
        const style = {
          left: `${end.x}%`,
          top: `${end.y}%`,
          '--fx': `${start.x}%`,
          '--fy': `${start.y}%`,
          '--tx': `${end.x}%`,
          '--ty': `${end.y}%`,
        } as CSSProperties;
        return (
          <div
            key={`${index}-${from}-${to}-${text}`}
            style={style}
            className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 animate-travel items-center gap-1"
          >
            <span className="size-4 rounded-full border-2 border-white bg-accent shadow" />
            {text && (
              <span className="rounded-md border border-accent bg-white px-2 py-0.5 text-xs font-bold whitespace-nowrap text-accent 2xl:text-sm">
                {text}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
