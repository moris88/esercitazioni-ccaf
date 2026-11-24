import { useEffect, useRef } from 'react';
import type { Scene } from '../types';
import { StepView } from './StepView';

interface SimulatorPaneProps {
  scene: Scene;
  pane: 0 | 1;
  index: number;
  progress: number;
}

export function SimulatorPane({ scene, pane, index, progress }: SimulatorPaneProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Segue l'ultima riga, anche mentre il testo si allunga
  // biome-ignore lint/correctness/useExhaustiveDependencies: lo scroll dipende dall'avanzamento
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'nearest' });
  }, [index, progress]);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      {scene.panes && (
        <div className="border-b border-line bg-sand px-4 py-2 font-bold text-accent">
          {scene.panes[pane]}
        </div>
      )}
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-5">
        {scene.steps.map((step, stepIndex) =>
          stepIndex <= index && (step.pane ?? 0) === pane ? (
            // L'elenco dei passi è fisso: l'indice è una chiave stabile
            // biome-ignore lint/suspicious/noArrayIndexKey: elenco statico
            <div key={stepIndex} className="animate-enter">
              <StepView
                step={step}
                simulator={scene.simulator}
                progress={stepIndex === index ? progress : 1}
              />
            </div>
          ) : null,
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
