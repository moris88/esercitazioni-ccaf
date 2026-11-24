import { useState } from 'react';
import type { Exercise } from '../types';
import { ScenePlayer } from './ScenePlayer';

interface ExerciseViewProps {
  exercise: Exercise;
}

export function ExerciseView({ exercise }: ExerciseViewProps) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const scene = exercise.scenes[sceneIndex];

  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <header className="border-b border-line px-5 py-4">
        <p className="text-sm font-bold text-accent uppercase">
          Esercitazione {exercise.code} · {exercise.lesson}
        </p>
        <h1 className="font-serif text-3xl font-bold">{exercise.title}</h1>
        <p className="text-muted">
          Dove: {exercise.place} · Durata: {exercise.minutes} min
        </p>
        {exercise.scenes.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {exercise.scenes.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={index === sceneIndex}
                onClick={() => setSceneIndex(index)}
                className={`rounded-full border px-4 py-1.5 ${
                  index === sceneIndex ? 'border-accent bg-accent text-white' : 'border-line hover:bg-sand'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>
      {/* La chiave azzera la riproduzione quando cambia la scena */}
      <ScenePlayer key={scene.id} exercise={exercise} scene={scene} />
    </main>
  );
}
