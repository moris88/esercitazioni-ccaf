import { useEffect, useRef } from 'react';
import { FlowDiagram } from '../diagrams/FlowDiagram';
import type { Diagram, Exercise } from '../types';

interface InfoPanelProps {
  exercise: Exercise;
  diagram?: Diagram;
  path: string[];
  /** Indici dei punti già rivelati, dal più vecchio al più recente */
  revealed: number[];
}

const HEADING = 'mb-2 text-sm font-bold text-accent uppercase';

export function InfoPanel({ exercise, diagram, path, revealed }: InfoPanelProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const latest = revealed.at(-1);

  // Porta in vista l'ultimo punto rivelato
  useEffect(() => {
    if (latest !== undefined) listRef.current?.children[latest]?.scrollIntoView({ block: 'nearest' });
  }, [latest]);

  return (
    <aside className="flex w-[21rem] shrink-0 flex-col border-l border-line 2xl:w-[25rem]">
      {diagram && (
        <div className="shrink-0 border-b border-line p-5">
          <FlowDiagram diagram={diagram} path={path} />
        </div>
      )}
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
        <section>
          <h2 className={HEADING}>Obiettivo</h2>
          <p>{exercise.goal}</p>
        </section>
        <section>
          <h2 className={HEADING}>Cosa osservare</h2>
          <ul ref={listRef} className="space-y-2">
            {exercise.observe.map((text, index) => (
              <li
                key={text}
                className={`rounded-lg border-l-4 px-3 py-2 transition-all duration-500 ${
                  revealed.includes(index) ? 'border-accent bg-blush' : 'border-line text-muted'
                }`}
              >
                {text}
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg bg-blush p-4">
          <strong>Il collegamento con l'esame: </strong>
          {exercise.exam}
        </section>
      </div>
    </aside>
  );
}
