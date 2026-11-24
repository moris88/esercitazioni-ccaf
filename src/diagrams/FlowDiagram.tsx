import type { Diagram, DiagramNode } from '../types';

interface FlowDiagramProps {
  diagram: Diagram;
  path: string[];
}

const HALF_WIDTH = 56;
const HALF_HEIGHT = 20;
/** Distanza tra le due frecce di una coppia andata/ritorno */
const PAIR_OFFSET = 9;

/** Segmento tra due nodi, fermato al bordo dei rettangoli */
function segment(from: DiagramNode, to: DiagramNode, offset: number) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  const reach = Math.min(
    dx === 0 ? Infinity : HALF_WIDTH / Math.abs(dx),
    dy === 0 ? Infinity : HALF_HEIGHT / Math.abs(dy),
  );
  const gap = reach + 3 / length;
  const shiftX = (-dy / length) * offset;
  const shiftY = (dx / length) * offset;
  return {
    x1: from.x + dx * gap + shiftX,
    y1: from.y + dy * gap + shiftY,
    x2: to.x - dx * gap + shiftX,
    y2: to.y - dy * gap + shiftY,
  };
}

export function FlowDiagram({ diagram, path }: FlowDiagramProps) {
  const nodes = new Map(diagram.nodes.map((node) => [node.id, node]));
  const hasEdge = (from: string, to: string) => diagram.edges.some((e) => e.from === from && e.to === to);
  const isActive = (from: string, to: string) => path.some((id, i) => id === from && path[i + 1] === to);

  return (
    <svg viewBox="0 12 320 190" className="w-full shrink-0" role="img" aria-label="Schema del flusso">
      <defs>
        {[
          ['idle', 'fill-line'],
          ['active', 'fill-accent'],
        ].map(([id, fill]) => (
          <marker
            key={id}
            id={`arrow-${id}`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0 0L10 5L0 10z" className={fill} />
          </marker>
        ))}
      </defs>
      {diagram.edges.map(({ from, to }) => {
        const start = nodes.get(from);
        const end = nodes.get(to);
        if (!start || !end) return null;
        const active = isActive(from, to);
        return (
          <line
            key={`${from}-${to}`}
            {...segment(start, end, hasEdge(to, from) ? PAIR_OFFSET : 0)}
            strokeWidth={active ? 3 : 2}
            strokeDasharray={active ? '8 8' : undefined}
            markerEnd={`url(#arrow-${active ? 'active' : 'idle'})`}
            className={active ? 'animate-flow stroke-accent' : 'stroke-line'}
          />
        );
      })}
      {diagram.nodes.map(({ id, label, x, y }) => {
        const active = path.includes(id);
        return (
          <g key={id}>
            <rect
              x={x - HALF_WIDTH}
              y={y - HALF_HEIGHT}
              width={HALF_WIDTH * 2}
              height={HALF_HEIGHT * 2}
              rx="8"
              strokeWidth="2"
              className={`transition-colors duration-300 ${active ? 'fill-accent stroke-accent' : 'fill-sand stroke-line'}`}
            />
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              className={`text-[13px] ${active ? 'fill-white' : 'fill-ink'}`}
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
