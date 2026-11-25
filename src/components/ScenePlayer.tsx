import { usePlayer } from '../player/usePlayer';
import { usePlayerKeys } from '../player/usePlayerKeys';
import { SimulatorWindow } from '../simulators/SimulatorWindow';
import type { Exercise, Scene } from '../types';
import { InfoPanel } from './InfoPanel';
import { PlayerControls } from './PlayerControls';

interface ScenePlayerProps {
  exercise: Exercise;
  scene: Scene;
}

export function ScenePlayer({ exercise, scene }: ScenePlayerProps) {
  const player = usePlayer(scene.steps);
  usePlayerKeys(player.dispatch);

  const { index, progress } = player;
  // Un passo conta come "visto" solo quando il suo testo è completo
  const seen = scene.steps.slice(0, progress < 1 ? index : index + 1);
  const revealed = seen.flatMap((step) => step.observe ?? []);
  const path = scene.steps[index].path ?? seen.findLast((step) => step.path)?.path ?? [];
  const note = progress === 1 ? scene.steps[index].note : undefined;

  return (
    <div className="flex min-h-0 flex-1">
      <div className="flex min-w-0 flex-1 flex-col gap-4 p-5">
        <p className="rounded-lg bg-sand px-4 py-3">
          <span className="font-bold text-accent">Cosa vediamo: </span>
          {scene.description}
        </p>
        <SimulatorWindow scene={scene} chatTitle={exercise.title} index={index} progress={progress} />
        <div aria-live="polite" className="min-h-14">
          {note && (
            <p className="animate-enter rounded-lg border-l-4 border-accent bg-blush px-4 py-3 text-lg">
              {note}
            </p>
          )}
        </div>
        <PlayerControls player={player} total={scene.steps.length} />
      </div>
      <InfoPanel exercise={exercise} diagram={scene.diagram} path={path} revealed={revealed} />
    </div>
  );
}
